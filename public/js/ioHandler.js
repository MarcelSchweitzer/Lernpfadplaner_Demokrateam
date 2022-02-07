// import a number of lps into the current session
function importLP(learningPaths) {
  for (let i = 0; i < learningPaths.length; i++) {
    for (let j = 0; j < learningPaths[i].length; j++) {
      session.addlearningPath(learningPaths[i][j]);
      learningPathToServer(session.getlearningPathById(learningPaths[i][j].id), () => {
      }, true);
    }
  }
  setTimeout(() => {
    getHomePage();
  }, 1000);
}

// serve a list of learningPaths as a download for the user
function downloadlearningPaths(lps, format) {

  if (format === 'pdf' || format === 'json') {
    const text = JSON.stringify(lps, null, 4);
    const filename = session.learningPathOpened() ? session.getCurrentLearningPath().title + '.' + format : 'Meine_Lernpfade.' + format;

    download(filename, text);
  }
}

// downlad any number of lps in a certain format
function download(filename, text) {
  const tmp = document.createElement('a');
  tmp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  tmp.setAttribute('download', filename);
  tmp.style.display = 'none';
  document.body.appendChild(tmp);
  tmp.click();
  document.body.removeChild(tmp);
}

// generate a PDF Document for one or more scenarios
// TODO works for exactly one scenario - older ones get overwritten
function generatePDF(scenarios, title, index = null) {
  const offset = 20;
  const dinA4X = 592.28;
  const dinA4Y = 837.54;
  const fontSize = 12;
  const indent = 35;
  const space = 15;
  let offsetY = 0;
  let page = 1;

  const doc = new jsPDF('p', 'pt', 'a4');
  for (let i = 0; i < scenarios.length; i++) {
    let wrappedPage = false;
    if (i > 0) {
      offsetY = 0;
    }

    // alway begin new page for new lp
    doc.setPage(page);
    const ind = (index == null) ? i : index;
    canvasManager.scaleToZero(i);
    setTimeout(() => {

      html2canvas(document.getElementById('workspace' + ind)).then(function(canvas) {

        const imgdata = canvas.toDataURL();
        doc.addImage(imgdata, 'png', 0, 0, dinA4X, dinA4X/canvas.width * canvas.height);

        doc.setFontSize(fontSize);

        function printDict(dict, indentN = 1) {
          offsetY++;
          for (const [key, value] of Object.entries(dict)) {
            if (value) {

              // cap first letter of key
              const cappedKey = key.charAt(0).toUpperCase() + key.slice(1);

              // get offset for first page (canvas)
              initOffset = (!wrappedPage) ? dinA4X/canvas.width * canvas.height : 0;

              let yPos = fontSize * offsetY + space * offsetY  +  offset + initOffset;
              if (yPos > dinA4Y) {
                doc.addPage();
                wrappedPage = true;
                page++;
                offsetY = 1;
                doc.setPage(page);
                yPos = fontSize * offsetY + space * offsetY  +  offset;
              }

              // check for nested data
              if (typeof value === 'string' || typeof value === 'number') {

                // handle numbers
                text = (typeof value === 'string') ? value : '' + value;

                if (text !== '' && text !== ' ') {
                  doc.text(indent * indentN, yPos, cappedKey + ': ' + text);
                  offsetY++;
                }
              } else if (typeof value === 'object') {
                doc.text(indent * indentN, yPos, cappedKey + ':');
                printDict(value, indentN + 1);
                offsetY++;
              }
            }
          }
        }

        for (let y=0; y<=i;y++)
        {
          printDict(scenarios[y]);
        }

        if (i === scenarios.length - 1 ) {
          doc.save(title+'.pdf');
        }
      });
    }, 50);
  }
}

