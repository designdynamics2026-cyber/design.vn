(function () {
  var navItems = [
    { label: "Services", href: "/#service" },
    { label: "Pricing", href: "/#pricing" }
  ];

  function normalizedText(node) {
    return (node.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function hasLabel(root, label) {
    var wanted = label.toLowerCase();
    return Array.prototype.some.call(root.querySelectorAll("a"), function (link) {
      return normalizedText(link) === wanted;
    });
  }

  function makeMainNavLink(item) {
    var link = document.createElement("a");
    link.href = item.href;
    link.className = "nav-menu-link w-inline-block dd-nav-added";

    var dot = document.createElement("div");
    dot.className = "nav-menu-dot";
    dot.style.opacity = "0";

    var text = document.createElement("div");
    text.className = "nav-text";
    text.textContent = item.label;

    link.appendChild(dot);
    link.appendChild(text);
    return link;
  }

  function makeOverlayNavLink(item) {
    var wrapper = document.createElement("div");
    wrapper.className = "div-block-55 padding-104 dd-nav-added";

    var dot = document.createElement("div");
    dot.className = "dot-off display-none";

    var link = document.createElement("a");
    link.href = item.href;
    link.className = "nav-link w-nav-link";
    link.textContent = item.label;

    wrapper.appendChild(dot);
    wrapper.appendChild(link);
    return wrapper;
  }

  function makeDivider() {
    var divider = document.createElement("div");
    divider.className = "divider_horizontal dd-nav-added";
    return divider;
  }

  function insertMainNavItems(nav) {
    var wrap = nav.querySelector(".nav-menu-flex-down");
    if (!wrap || hasLabel(wrap, "Services")) return;

    var before = Array.prototype.find.call(wrap.children, function (child) {
      return child.matches && child.matches("a.nav-menu-link") && normalizedText(child) === "projects";
    });

    navItems.forEach(function (item) {
      wrap.insertBefore(makeMainNavLink(item), before || null);
    });
  }

  function insertOverlayNavItems(nav) {
    if (hasLabel(nav, "Services")) return;

    var links = Array.prototype.slice.call(nav.querySelectorAll("a.nav-link"));
    var projectLink = links.find(function (link) {
      return normalizedText(link) === "projects";
    });
    var before = projectLink ? projectLink.closest(".div-block-55") : nav.querySelector(".div-block-53");

    navItems.forEach(function (item) {
      nav.insertBefore(makeOverlayNavLink(item), before || null);
      nav.insertBefore(makeDivider(), before || null);
    });
  }

  function ensurePricingAnchor() {
    if (document.getElementById("pricing")) return;

    var contact = document.getElementById("contact") || document.querySelector(".section.contact");
    if (!contact || !contact.parentNode) return;

    var anchor = document.createElement("span");
    anchor.id = "pricing";
    anchor.className = "dd-nav-anchor";
    anchor.setAttribute("aria-hidden", "true");
    contact.parentNode.insertBefore(anchor, contact);
  }

  function initNavFixes() {
    ensurePricingAnchor();
    Array.prototype.forEach.call(document.querySelectorAll(".nav-menu-3"), insertMainNavItems);
    Array.prototype.forEach.call(document.querySelectorAll(".nav-menu"), insertOverlayNavItems);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavFixes);
  } else {
    initNavFixes();
  }
})();
