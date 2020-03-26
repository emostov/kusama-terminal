
// https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
// eslint-disable-next-line import/prefer-default-export
export function stringToNode(inner) {
  const template = document.createElement('template');
  const html = inner.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

export function displayTime(now) {
  const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const date = now.toDateString();
  return `${date} ${time}`;
}

export function displayBlockTime(milSecs) {
  const now = new Date(milSecs);
  return displayTime(now);
}

export function displayCurrentTime() {
  const now = new Date(Date.now());
  return displayTime(now);
}

export function displayBlock(block, terminal) {
  const { number, timeStamp, productionTime, extrinsicCount, hash } = block;
  // Create DOM elemnts to add and add to DOM


  const blockDiv = stringToNode(`
      <div id=${hash}> 
        <p>Block number: 
          <a href="https://polkascan.io/pre/kusama/block/${number}/">${number}</a>
        </p>
        <p>Hash: ${hash}</p>
        <p>Time stamp: ${displayBlockTime(timeStamp * 1000)}</p>
        <p>Production Time: ${productionTime } secs</p>
        <p>Total extrinsics: ${extrinsicCount}</p>
        <br/>
      </div>
    `);


  terminal.append(blockDiv);
}


