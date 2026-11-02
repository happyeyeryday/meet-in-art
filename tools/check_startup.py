"""Check the actual launchers in fresh source, offline and incomplete copies."""
from pathlib import Path
import json
import os
import re
import shutil
import subprocess
import tempfile
import time
import urllib.request

ROOT = Path(__file__).resolve().parents[1]


def stop(process):
    if os.name == 'nt':
        subprocess.run(['taskkill', '/PID', str(process.pid), '/T', '/F'], capture_output=True)
    else:
        import signal
        os.killpg(process.pid, signal.SIGTERM)
    process.wait(timeout=15)


def launch_and_check(app, log_path):
    command = (['cmd', '/d', '/c', str(app / 'start-demo.bat')] if os.name == 'nt'
               else ['bash', str(app / 'start-demo.sh')])
    with log_path.open('wb') as log:
        process = subprocess.Popen(command, cwd=app.parent, env={**os.environ, 'PORT': '0'},
                                   stdin=subprocess.DEVNULL, stdout=log, stderr=subprocess.STDOUT,
                                   start_new_session=os.name != 'nt')
        try:
            deadline = time.monotonic() + 120
            while time.monotonic() < deadline:
                output = log_path.read_text(encoding='utf-8', errors='replace')
                match = re.search(r'http://127\.0\.0\.1:(\d+)', output)
                if match:
                    base = match.group(0)
                    with urllib.request.urlopen(base, timeout=10) as response:
                        assert '与画相逢' in response.read().decode('utf-8')
                    for resource in ['src/main.js', 'models/pose_landmarker_full.task',
                                     'wasm/vision_wasm_module_internal.wasm', 'demo/desperate-after.png']:
                        request = urllib.request.Request(base + '/' + resource, method='HEAD')
                        with urllib.request.urlopen(request, timeout=10) as response:
                            assert response.status == 200, resource
                    return output
                if process.poll() is not None:
                    raise AssertionError(f'Launcher stopped early:\n{output}')
                time.sleep(.2)
            raise AssertionError('Launcher timed out: ' + output)
        finally:
            if process.poll() is None:
                stop(process)


def main():
    checks = []
    with tempfile.TemporaryDirectory(prefix='meet-in-art-startup-') as temporary:
        temp = Path(temporary)
        source = temp / 'source' / 'app'
        shutil.copytree(ROOT / 'app', source,
                        ignore=shutil.ignore_patterns('node_modules', 'dist', 'test-results', 'playwright-report'))
        assert not (source / 'node_modules').exists() and not (source / 'dist').exists()
        output = launch_and_check(source, temp / 'source.log')
        assert '首次启动' in output and (source / 'dist/index.html').is_file()
        checks.append('source launcher builds and serves without node_modules or existing dist')
        output = launch_and_check(source, temp / 'restart.log')
        assert '首次启动' not in output
        checks.append('second launch uses the existing build')

        offline = temp / 'offline' / 'app'
        (offline / 'scripts').mkdir(parents=True)
        shutil.copytree(source / 'dist', offline / 'dist')
        for name in ['start-demo.bat', 'start-demo.sh', 'scripts/start-demo.mjs', 'scripts/serve.mjs']:
            shutil.copy2(source / name, offline / name)
        output = launch_and_check(offline, temp / 'offline.log')
        assert '首次启动' not in output
        checks.append('prebuilt launcher works without source, dependencies or build script')

        incomplete = temp / 'incomplete' / 'scripts'
        incomplete.mkdir(parents=True)
        shutil.copy2(source / 'scripts/start-demo.mjs', incomplete / 'start-demo.mjs')
        result = subprocess.run(['node', str(incomplete / 'start-demo.mjs')],
                                capture_output=True, encoding='utf-8', timeout=15)
        assert result.returncode == 1 and '网页运行文件不完整' in result.stderr
        checks.append('incomplete download exits with a readable error')
    print(json.dumps({'passed': True, 'platform': os.name, 'checks': checks}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
