(function () {
  var DE = window.DiscourseEmbed || {};
  var comments = document.getElementById("discourse-comments");
  var iframe = document.createElement("iframe");

  [
    "showComments",
    "discourseUrl",
    "discourseEmbedUrl",
    "discourseUserName",
    "discourseReferrerPolicy",
  ].forEach(function (i) {
    if (window[i]) {
      DE[i] = DE[i] || window[i];
    }
  });

  var queryParams = {};

  if (DE.discourseEmbedUrl) {
    if (DE.discourseEmbedUrl.startsWith("/")) {
      console.error(
        "discourseEmbedUrl must be a full URL, not a relative path"
      );
    }

    queryParams.embed_url = encodeURIComponent(DE.discourseEmbedUrl);
  }

  if (DE.discourseUserName) {
    queryParams.discourse_username = DE.discourseUserName;
  }

  if (DE.topicId) {
    queryParams.topic_id = DE.topicId;
  }

  if (DE.className) {
    queryParams.class_name = DE.className;
  }

  if (DE.showComments !== undefined && DE.showComments !== null) {
    queryParams.show_comments = DE.showComments;
  } else {
    queryParams.show_comments = true;
  }

  var src = DE.discourseUrl + "embed/comments";
  var keys = Object.keys(queryParams);
  if (keys.length > 0) {
    src += "?";

    for (var i = 0; i < keys.length; i++) {
      if (i > 0) {
        src += "&";
      }

      var k = keys[i];
      src += k + "=" + queryParams[k];
    }
  }

  iframe.src = src;
  iframe.id = "discourse-embed-frame";
  iframe.width = "100%";
  iframe.frameBorder = "0";
  iframe.scrolling = "no";
  iframe.referrerPolicy =
    DE.discourseReferrerPolicy || "no-referrer-when-downgrade";
  comments.appendChild(iframe);

  // Thanks http://amendsoft-javascript.blogspot.ca/2010/04/find-x-and-y-coordinate-of-html-control.html
  function findPosY(obj) {
    var top = 0;
    if (obj.offsetParent) {
      while (1) {
        top += obj.offsetTop;
        if (!obj.offsetParent) break;
        obj = obj.offsetParent;
      }
    } else if (obj.y) {
      top += obj.y;
    }
    return top;
  }

  function normalizeUrl(url) {
    return url.replace(/^https?(\:\/\/)?/, "");
  }

  function postMessageReceived(e) {
    if (!e) {
      return;
    }
    if (!normalizeUrl(DE.discourseUrl).includes(normalizeUrl(e.origin))) {
      return;
    }

    if (e.data) {
      if (e.data.type === "discourse-resize" && e.data.height) {
        iframe.height = e.data.height + "px";
      }

      if (e.data.type === "discourse-scroll" && e.data.top) {
        // find iframe offset
        var destY = findPosY(iframe) + e.data.top;
        window.scrollTo(0, destY);
      }
    }
  }
  window.addEventListener("message", postMessageReceived, false);
})();
