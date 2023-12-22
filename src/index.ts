import './css/index.css';
import { Terminal } from './lib/terminal';

const root = document.createElement('div');
root.id = 'root';
root.style.marginLeft = '20px';
root.style.width = '800px';
root.style.height = '600px';

function onStart() {
  document.body.appendChild(root);

  const t = new Terminal(root);

  t.writeUpdates([[0, 3, 'a', 'red', 'blue']]);

  t.writeUpdates([
    [10, 5, 'j', 'white', 'red'],
    [10, 6, 'a', 'white', 'red'],
    [10, 7, 'm', 'white', 'red'],
    [10, 8, 'e', 'white', 'red'],
    [10, 9, 's', 'white', 'red'],
  ]);
  t.render();
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', onStart)
  : onStart();
