if (typeof window !== 'undefined') global = window;

var SG_START = global.SG_START || false;

var sg_index = {
  init: function() {
    if ($('.huge-iframe-content').length && !SG_START) return false;

    this.$body = $('body');
    this.$breakpointsLinks = $('.idp-header__breakpoints__item__link');
    this.$sidebarContent = $('.idp-sidebar__content');
    this.$sidebarLinks = $('.idp-sidebar__nav__item__link');
    this.$sidebarToggle = $('[class*="idp-sidebar__toggle"]');
    this.$iframe = $('.idp-iframe-wrapper iframe');
    this.$iframeContent = this.isChromeAndFileProtocol() ? null : $('.idp-iframe-wrapper iframe').contents();

    this.sidebarOpenedClass = 'opened';
    this.sidebarActiveLinkClass = 'active';
    this.sidebarLinkWasClickedClass = 'side-menu-clicked';

    if (SG_START) return false;

    this.sidebarSetup();
    this.checkHashOnLoad();
    this.events();
  },

  isChromeAndFileProtocol: function() {
    if (SG_START) return false;
    return (window.location.protocol === 'file:' && navigator.userAgent.toLowerCase().indexOf('chrome') > -1);
  },

  /**
   * All events of the structure
   * should be registered here
   */
  events: function() {
    var _this = this;

    this.$breakpointsLinks.click(function() {
      _this.resizeContent($(this));
    });

    this.$sidebarLinks.click(function(e) {
      e.preventDefault();
      _this.setActiveSidebarLinkOnClick($(this));
      _this.navigateToAnchor($(this));
    });

    this.$sidebarToggle.click(function(e) {
      e.preventDefault();
      _this.$body.toggleClass(_this.sidebarOpenedClass);
    });

    $(window).resize(function() {
      _this.sidebarResizeHandler();
    });
  },

  /**
   * Resize iframe based on
   * the breakpoint choice
   */
  resizeContent: function($elem) {
    var sizeLabel = $elem.data('size-label'),
      size = sizeLabel === 'full' ? $elem.data('size') : parseInt($elem.data('size').replace('px', ''), 10);

    this.$iframe.width(size);
  },

  /**
   * Check URL hash and navigate
   * to the respective module
   */
  checkHashOnLoad: function() {

    // Shutdown this feature in Chrome.
    // Chrome have a know issue with file protocol and iframe comunication.
    // It is not supported so we should not raise errors.
    if(this.isChromeAndFileProtocol()) return false;
    if (window.location.hash === '#' || window.location.hash === '') return false;

    var top = this.$iframeContent.find('section' + window.location.hash.replace('!', '')).offset().top,
      $iframeHtmlBody = this.$iframeContent.find('html, body');

    if (this.$iframeContent.find('section' + window.location.hash.replace('!', '')).index() === 0) {
      $(window).load(function() {
        $iframeHtmlBody.animate({scrollTop: 0}, 500);
      });
    } else {
      $iframeHtmlBody.animate({scrollTop: top + 20}, 0);
    }
  },

  /**
   * Navigate to module on
   * sidebar links click
   */
  navigateToAnchor: function($elem) {

    // Shutdown this feature in Chrome.
    // Chrome have a know issue with file protocol and iframe comunication.
    // It is not supported so we should not raise errors.
    if(this.isChromeAndFileProtocol()) return false;

    var top = this.$iframeContent.find('section' + $elem.attr('href')).offset().top + 50;

    // Use ! to prevent de default browser behavior of anchor navigation
    window.location.hash = '!' + $elem.attr('href').replace('#', '');

    this.$iframeContent.find('html, body').animate({scrollTop: top}, 800);
  },
  sidebarOpen: function() {
    this.$body.addClass('opened');
  },
  sidebarClose: function() {
    this.$body.removeClass('opened');
  },

  /**
   * Leave or close the sidebar
   * if the window is small
   */
  sidebarResizeHandler: function() {
    if ($(window).width() <= 1220) {
      this.sidebarClose();
    } else {
      this.sidebarOpen();
    }
  },
  sidebarSetup: function() {

    // Shutdown this feature in Chrome.
    // Chrome have a know issue with file protocol and iframe comunication.
    // It is not supported so we should not raise errors.
    if(this.isChromeAndFileProtocol()) {
      this.$sidebarContent.remove();
      this.$sidebarToggle.remove();
      return false;
    }

    if ($(window).width() >= 1220) {
      this.sidebarOpen();
    }
  },
  setActiveSidebarLinkOnClick: function($elem) {
    this.$body.addClass(this.sidebarLinkWasClickedClass);
    this.$sidebarLinks.removeClass(this.sidebarActiveLinkClass);
    $elem.addClass(this.sidebarActiveLinkClass);
  }
};

if(!SG_START) {
  $(window).load(function() {
    sg_index.init();
  });
} else {
  SG_START.sg_index = sg_index;
}
