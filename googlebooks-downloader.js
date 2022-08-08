/*
  [^] Google Books downloader function [^]
    Enter the book you want to downloaded, open console and copy this script.
    then write 'scrapeBook.start()' on the console. At this stage, the script start the process and will automatically moving the pages of the book.
    Once the process down (console return undefined) write 'scrapeBook.finish()', You'll transfered to another website. let the download manager do his own.

    This grabber convert it to .png files for each page that downloaded. If you hope to convert it to one-file .pdf you can use a online websites converter,
    the downloaded file should named as 'page-xxx.png' when 'xxx' stands for the number of page, ex.: 'page-0103.png'
*/

var scrapeBook = (function () {
  let book = document.getElementById("viewport"),
    scroll = document.getElementsByClassName("overflow-scrolling");
  let scrollOpt = {
    height: scroll[0].scrollHeight,
    amount: 700,
    count: 0,
    id: "",
  };
  let links = [],
    targets = [];
  let observer = null;

  let callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type == "childList") {
        targets = mutation.target.getElementsByTagName("img");
        if (targets) for (let target of targets) links.push(target.src);
      }
    }
  };

  let turnPage = function () {
    scrollOpt.count += scrollOpt.amount;
    scrollOpt.count < scrollOpt.height
      ? scroll[0].scrollBy(0, scrollOpt.amount)
      : clearInterval(scrollOpt.id);
  };

  let downloadPages = function (e) {
    function next(i) {
      if (i >= e.length) return;
      if (e[i].href.match(/books.google./)) e[i].click();
      setTimeout(function () {
        next(i + 1);
      }, 500);
    }
    next(0);
  };

  return {
    start: function () {
      observer = new MutationObserver(callback);
      observer.observe(book, {
        attributes: true,
        childList: true,
        subtree: true,
      });
      scrollOpt.id = setInterval(turnPage, 500);
    },

    finish: function () {
      {
        let matchLinks = new Set(links),
          renderWindow = window.open(),
          numberOfPage = 0;
        for (let link of matchLinks) {
          renderWindow.document.write(
            `<a href="${link}" download="page-0${numberOfPage}">${link}"</a><br>`
          );
          numberOfPage++;
        }
        let anchors = renderWindow.document.getElementsByTagName("a");
        downloadPages(anchors);
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      }
    },
  };
})();
