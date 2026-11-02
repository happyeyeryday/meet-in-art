"""Publish ASCII-named assets sequentially, then make the complete release visible."""
from pathlib import Path
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
ASSETS = [
    ('入画_离线演示包.zip', 'meet-in-art-demo.zip', '离线演示包'),
    ('名画仿拍_完整结课包.zip', 'meet-in-art-course.zip', '完整结课包'),
]


def prepare(destination):
    destination.mkdir(parents=True, exist_ok=True)
    files = []
    for source, name, label in ASSETS:
        target = destination / name
        shutil.copyfile(ROOT / 'deliverables' / source, target)
        files.append((target, label))
    sums = destination / 'SHA256SUMS.txt'
    sums.write_text(''.join(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}\n' for p, _ in files))
    return [*files, (sums, 'SHA-256 校验值')]


def gh(*args, allow_missing=False):
    result = subprocess.run(['gh', *args], capture_output=True, text=True, encoding='utf-8')
    if result.returncode:
        if allow_missing and 'HTTP 404' in result.stderr:
            return None
        raise RuntimeError(result.stderr.strip() or result.stdout.strip() or 'GitHub command failed')
    return result.stdout


def find_release(repo, tag):
    # The /releases/tags/{tag} endpoint only returns published releases.
    # Authenticated release listings include drafts; use their numeric IDs.
    pages = json.loads(gh('api', f'repos/{repo}/releases?per_page=100', '--paginate', '--slurp'))
    return next((release for page in pages for release in page if release['tag_name'] == tag), None)


def main():
    if len(sys.argv) == 3 and sys.argv[1] == '--prepare-only':
        for path, _ in prepare(Path(sys.argv[2])):
            print(path.name, path.stat().st_size)
        return
    repo, tag = os.environ['GITHUB_REPOSITORY'], os.environ['RELEASE_TAG']
    current = find_release(repo, tag)
    if current is None:
        gh('release', 'create', tag, '--repo', repo, '--verify-tag', '--draft',
           '--title', f'与画相逢 {tag}', '--notes-file', str(ROOT / '.github/RELEASE_NOTES.md'))
        current = find_release(repo, tag)
        if current is None:
            raise RuntimeError('已创建草稿，但暂未能读取草稿元数据；可重新运行此发布任务。')
    elif not current['draft']:
        raise RuntimeError('该版本已经公开发布，不覆盖已发布的附件；请使用新版本标签。')
    endpoint = f"repos/{repo}/releases/{current['id']}"

    with tempfile.TemporaryDirectory(prefix='meet-in-art-release-') as temporary:
        files = prepare(Path(temporary))
        for path, label in files:
            # --clobber is restricted to this unpublished draft, allowing a failed
            # run to resume without ever replacing publicly released artifacts.
            for attempt in range(3):
                try:
                    gh('release', 'upload', tag, f'{path}#{label}', '--repo', repo, '--clobber')
                    break
                except RuntimeError:
                    if attempt == 2:
                        raise
                    time.sleep(3 * (attempt + 1))
            print('Uploaded:', path.name, flush=True)
        release = json.loads(gh('api', endpoint))
        assert release['draft'], 'Release unexpectedly became public during upload'
        remote = {asset['name']: asset for asset in release['assets']}
        for path, _ in files:
            asset = remote[path.name]
            assert asset['state'] == 'uploaded' and asset['size'] == path.stat().st_size, path.name
            digest = asset.get('digest')
            if digest:
                assert digest == 'sha256:' + hashlib.sha256(path.read_bytes()).hexdigest(), path.name
        gh('release', 'edit', tag, '--repo', repo, '--draft=false', '--latest')
        print(f'Published: https://github.com/{repo}/releases/tag/{tag}')


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        message = str(error)
        print(message, file=sys.stderr)
        if os.environ.get('GITHUB_ACTIONS') == 'true':
            escaped = message.replace('%', '%25').replace('\r', '%0D').replace('\n', '%0A')
            print('::error title=Release upload::' + escaped)
        sys.exit(1)
