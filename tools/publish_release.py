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
from urllib.parse import urlencode, urlsplit

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


def gh(*args):
    result = subprocess.run(['gh', *args], capture_output=True, text=True, encoding='utf-8')
    if result.returncode:
        detail = result.stderr.strip() or result.stdout.strip() or 'GitHub command failed'
        raise RuntimeError(f"{' '.join(args[:2])}: {detail}")
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
    if current is not None and not current['draft']:
        raise RuntimeError('该版本已经公开发布，不覆盖已发布的附件；请使用新版本标签。')

    with tempfile.TemporaryDirectory(prefix='meet-in-art-release-') as temporary:
        files = prepare(Path(temporary))
        if current is None:
            request = Path(temporary) / 'release.json'
            request.write_text(json.dumps({'tag_name': tag, 'target_commitish': os.environ.get('GITHUB_SHA', 'main'),
                'name': f'与画相逢 {tag}', 'draft': True, 'prerelease': False,
                'body': (ROOT / '.github/RELEASE_NOTES.md').read_text()}, ensure_ascii=False), encoding='utf-8')
            current = json.loads(gh('api', f'repos/{repo}/releases', '--method', 'POST', '--input', str(request)))
        # Keep the creation response: draft lookup by tag/name is unreliable.
        endpoint = f"repos/{repo}/releases/{current['id']}"
        upload_url = current['upload_url'].split('{', 1)[0]
        assert urlsplit(upload_url).scheme == 'https' and urlsplit(upload_url).hostname == 'uploads.github.com'
        print('Created/resuming draft ID:', current['id'], flush=True)
        for path, label in files:
            previous = next((asset for asset in current.get('assets', []) if asset['name'] == path.name), None)
            if previous is not None:
                # Only replace an asset in this still-unpublished draft.
                gh('api', f"repos/{repo}/releases/assets/{previous['id']}", '--method', 'DELETE')
            for attempt in range(3):
                try:
                    content_type = 'application/zip' if path.suffix == '.zip' else 'text/plain'
                    gh('api', upload_url + '?' + urlencode({'name': path.name, 'label': label}),
                       '--method', 'POST', '--header', 'Content-Type: ' + content_type, '--input', str(path))
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
        request = Path(temporary) / 'publish.json'
        request.write_text(json.dumps({'draft': False, 'tag_name': tag, 'make_latest': 'true'}))
        gh('api', endpoint, '--method', 'PATCH', '--input', str(request))
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
