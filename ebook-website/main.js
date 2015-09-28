var config = {
    selector: 'js-bold-headings',
    split_join_char: " ",
    index_url: "http://buildthemes.tumblr.com",
    chapter_id: "ch",
    chapter_colors: ['#8FFFD8', '#FFF28F', '#FFAF8F', '#FF8FEE', '#8FFFA8', '#AB9FFF'],
    url_schema: "http://buildthemes.tumblr.com/ch%s/%s"
};

var state = {
    headings: [],
    chapterNavDropdown: document.getElementById('chapter-nav-dropdown'),
    navChevron: document.getElementById('chapter-nav-chevron'),
    isMenuOpen: false,
    menuClearHeight: '3em'
};

var util = {
  trimTrailingCharacter: function(text, trailingCharacter) {
    var lastCharPosition = text.length - 1;
    var lastChar = text[lastCharPosition];
    if (lastChar == trailingCharacter) {
      return text.substring(0, lastCharPosition);
    }
    return text;
  }
}

var view = {
    embolden: function() {
      for (var i = 0; i < state.headings.length; i++) {
        var heading = state.headings[i];
        var headingHTML = this.getSplitHTML(heading);
        // Embolden first word of heading
        headingHTML[0] = '<b>' + headingHTML[0] + '</b>';
        this.setSplitHTML(heading, headingHTML)
      }
    },
    getSplitHTML: function(elem) {
        return elem.innerHTML.split(config.split_join_char);
    },
    setSplitHTML: function(elem, splitContent) {
        var content = splitContent.join(config.split_join_char);
        elem.innerHTML = content;
    },
    setChapterButton: function(chapter_number, url) {
        var postChapterElem = document.getElementById('post-chapter');
        postChapterElem.innerHTML = "Chapter " + chapter_number;
        postChapterElem.href = url;
        postChapterElem.className = "";
    },
    setChapterBackground: function(chapter_number) {
        var metadata = document.getElementById('metadata');
        metadata.style.backgroundColor = config.chapter_colors[chapter_number - 1];
    },
    openMenu: function() {
        state.chapterNavDropdown.className = 'js-show'
        state.navChevron.className = 'fa fa-angle-up';
    },
    closeMenu: function() {
        state.chapterNavDropdown.className = 'js-hide';
        state.navChevron.className = 'fa fa-angle-down';
    },
    setNavClearHeight: function(height) {
        var clearHeader = document.getElementById('clear-header');
        clearHeader.style.height = height + 'px';
    }
};

var controller = {
    init: function() {
        this.initEmbolden();
        this.initUrlParse();
        this.initMenu();
    },
    initEmbolden: function() {
        this.getHeadings();
        view.embolden();
    },
    initUrlParse: function() {
        var current_chapter = this.parseURL();
        if (current_chapter.chapterNumber > 0) {
          view.setChapterBackground(current_chapter.chapterNumber);
        }
        if (current_chapter.isChapterPage) {
          view.setChapterButton(current_chapter.chapterNumber,
            this.createChapterURL(current_chapter.chapterNumber));
        }
    },
    initMenu: function() {
        this.registerChapterMenuListener();
        this.registerMenuListener();
        this.setMenuClear();
    },
    getHeadings: function() {
        state.headings = document.getElementsByClassName(config.selector);
    },
    parseURL: function() {
        var cleanURL = util.trimTrailingCharacter(window.location.href, "/")
        var currentURL = cleanURL.split("/");
        var schemaURL = config.url_schema.split("/");
        var suspect_chapter = currentURL[3];

        // If path has "ch" in URL
        if (suspect_chapter.substring(0, 2) == config.chapter_id) {
          var chapterNum = suspect_chapter.substring(2);
          // If current URL is like the schema for a chapter's page
          if (currentURL.length == schemaURL.length) {
            return {chapterNumber: chapterNum, isChapterPage: true };
          }
          // Else not a chapter page
          return {chapterNumber: chapterNum, isChapterPage: false };
        }

        return {chapterNumber: -1, isChapterPage: false };
    },
    createChapterURL: function(chapter_num) {
        var URL_SEP = "/";
        return config.index_url + URL_SEP + config.chapter_id + chapter_num;
    },
    setMenuClear: function() {
        var chapterHeader = document.getElementById('chapter-header');
        var chapterHeaderHeight = chapterHeader.offsetHeight;
        if (state.menuClearHeight != chapterHeaderHeight) {
          view.setNavClearHeight(chapterHeaderHeight);
          state.menuClearHeight = chapterHeaderHeight;
        }
    },
    registerMenuListener: function() {
        window.addEventListener('resize', this.setMenuClear);
    },
    registerChapterMenuListener: function() {
        var chapterMenu = document.getElementById("chapter-nav");
        chapterMenu.addEventListener("click", this.onChapterMenuClick);
    },
    onChapterMenuClick: function() {
        state.isMenuOpen ?  view.closeMenu() : view.openMenu();
        state.isMenuOpen = !state.isMenuOpen;
    }
};
controller.init();
