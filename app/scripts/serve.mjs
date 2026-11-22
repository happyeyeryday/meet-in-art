import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile,stat} from 'node:fs/promises';

const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT || 4173);
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.wasm':'application/wasm','.task':'application/octet-stream','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ttf':'font/ttf','.svg':'image/svg+xml'};

/* ---- 可选：AI 点评（OpenAI 兼容接口，默认关闭） ----
   令牌推荐写在本机的 app/.env（已被 .gitignore 忽略，不会进仓库）：
     AI_API_KEY=...
     AI_BASE_URL=https://chat.ecnu.edu.cn/open/api/v1
     AI_MODEL=ecnu-plus
   也可以直接用环境变量覆盖（环境变量优先）：
     AI_API_KEY / AI_BASE_URL / AI_MODEL / AI_MOCK=1
   没有配置 AI_API_KEY 时，AI 点评不启用，页面只用本地评语。
*/
try {
  const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env');
  const text = await readFile(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
} catch {}

const AI = {
  key: process.env.AI_API_KEY || '',
  base: (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, ''),
  model: process.env.AI_MODEL || 'gpt-4o-mini',
  mock: process.env.AI_MOCK === '1'
};
const AI_ON = AI.mock || !!AI.key;

const CSP = "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self'; connect-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'";

function send(res, code, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(code, {'Content-Type': type, 'Cache-Control': 'no-store'});
  res.end(body);
}
function json(res, code, value) {
  send(res, code, JSON.stringify(value), 'application/json; charset=utf-8');
}
function readBody(req, limit = 8 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', chunk => {
      size += chunk.length;
      if (size > limit) { reject(new Error('请求体过大')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const REVIEW_SYSTEM = `你是一位耐心的艺术老师，正在指导一位用照片模仿名画的人。
你会看到两张图：第一张是原画，第二张是学习者的仿拍。
请严格从三个方面点评：构图（人物在画面中的位置、大小、留白）、动作（头部位置与倾斜、肩线、手的位置）、颜色（主色、明暗关系）。
用 2-3 句中文，90 字以内；先说一处做得好的地方，再给一处最值得再试的调整；具体、温和、可执行；不要打分，不要说“很棒/完美”这类空话。`;

async function handleReview(req, res) {
  if (!AI_ON) return json(res, 503, {error: 'AI 点评未启用'});
  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch {
    return json(res, 400, {error: '请求格式不正确'});
  }
  const {original, photo, metrics} = payload || {};
  if (typeof original !== 'string' || typeof photo !== 'string' || !original.startsWith('data:image/') || !photo.startsWith('data:image/')) {
    return json(res, 400, {error: '缺少原画或照片'});
  }

  if (AI.mock) {
    return json(res, 200, {text: '（模拟点评）头的位置比原画略偏右，肩膀稍平；手更贴近身体，这一点很像原画。可以试着把头再向左回一点，让视线和肩膀的斜线对上。'});
  }

  const body = {
    model: AI.model,
    temperature: 0.6,
    max_tokens: 300,
    messages: [
      {role: 'system', content: REVIEW_SYSTEM},
      {role: 'user', content: [
        {type: 'text', text: '测量数据：' + JSON.stringify(metrics || {})},
        {type: 'image_url', image_url: {url: original}},
        {type: 'image_url', image_url: {url: photo}}
      ]}
    ]
  };

  try {
    const r = await fetch(AI.base + '/chat/completions', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + AI.key},
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(45000)
    });
    if (!r.ok) {
      const detail = await r.text();
      console.error('AI 点评失败:', r.status, detail.slice(0, 500));
      return json(res, 502, {error: '模型服务返回 ' + r.status});
    }
    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== 'string' || !text.trim()) return json(res, 502, {error: '模型没有返回文字'});
    json(res, 200, {text: text.trim()});
  } catch (e) {
    console.error('AI 点评请求失败:', e.message);
    json(res, 502, {error: '无法连接模型服务'});
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);

    if (pathname === '/api/ai-status') {
      return json(res, 200, {enabled: AI_ON, model: AI_ON ? (AI.mock ? 'mock' : AI.model) : null});
    }
    if (pathname === '/api/review') {
      if (req.method !== 'POST') return send(res, 405, 'Method Not Allowed');
      return handleReview(req, res);
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }

    const target = path.resolve(base, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!target.startsWith(base + path.sep)) { res.writeHead(403); res.end(); return; }
    if (!(await stat(target)).isFile()) throw new Error('Not a file');
    res.setHeader('Content-Type', mime[path.extname(target)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache'); res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', CSP);
    res.end(req.method === 'HEAD' ? undefined : await readFile(target));
  } catch {
    res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end('文件不存在，请检查离线资源包是否完整。');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`与画相逢：http://127.0.0.1:${server.address().port}  (Ctrl+C 停止)${AI_ON ? '  [AI 点评已启用]' : ''}`));
server.on('error', e => { console.error('本地服务无法启动：', e.message); process.exitCode = 1; });
