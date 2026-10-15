/* Ormer Events — site behaviour: mobile nav, scroll reveal, venue filter, form validation */
(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("#primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealables = document.querySelectorAll(".reveal");
  if (revealables.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealables.forEach(function (el) {
        io.observe(el);
      });
    } else {
      revealables.forEach(function (el) {
        el.classList.add("is-in");
      });
    }
  }

  /* ---------- Venue filtering, sorting and view switch ---------- */
  var panel = document.querySelector("#venue-filters");
  var emptyMsg = document.querySelector(".filter-empty");

  if (panel) {
    var cardWrap = document.querySelector("#venue-cards");
    var rowWrap = document.querySelector("#venue-rows");
    var tableWrap = document.querySelector("#venue-table");
    var searchBox = document.querySelector("#venue-search");
    var capacityBox = document.querySelector("#venue-capacity");
    var sortBox = document.querySelector("#venue-sort");
    var countBox = document.querySelector("#result-count");
    var resetBtn = document.querySelector("#filter-reset");
    var viewBtn = document.querySelector("#view-toggle");
    var boxes = panel.querySelectorAll("[data-facet]");
    var total = cardWrap ? cardWrap.querySelectorAll("[data-filterable]").length : 0;

    var checkedValues = function (facet) {
      var out = [];
      boxes.forEach(function (b) {
        if (b.getAttribute("data-facet") === facet && b.checked) out.push(b.value);
      });
      return out;
    };

    var matches = function (el, state) {
      if (state.types.length && state.types.indexOf(el.getAttribute("data-type")) === -1) return false;
      if (state.parishes.length && state.parishes.indexOf(el.getAttribute("data-parish")) === -1) return false;
      if (Number(el.getAttribute("data-max")) < state.capacity) return false;

      var features = (el.getAttribute("data-features") || "").split(/\s+/);
      for (var i = 0; i < state.features.length; i++) {
        if (features.indexOf(state.features[i]) === -1) return false;
      }

      if (state.query) {
        var hay = (el.getAttribute("data-name") || "").toLowerCase();
        if (hay.indexOf(state.query) === -1) return false;
      }
      return true;
    };

    var sortNodes = function (wrap) {
      if (!wrap) return;
      var mode = sortBox ? sortBox.value : "capacity-desc";
      var nodes = Array.prototype.slice.call(wrap.querySelectorAll("[data-filterable]"));
      nodes.sort(function (a, b) {
        if (mode === "name") {
          return (a.getAttribute("data-name") || "").localeCompare(b.getAttribute("data-name") || "");
        }
        var diff = Number(a.getAttribute("data-max")) - Number(b.getAttribute("data-max"));
        return mode === "capacity-asc" ? diff : -diff;
      });
      nodes.forEach(function (n) {
        wrap.appendChild(n);
      });
    };

    var apply = function () {
      var state = {
        types: checkedValues("type"),
        parishes: checkedValues("parish"),
        features: checkedValues("features"),
        capacity: capacityBox ? Number(capacityBox.value) : 0,
        query: searchBox ? searchBox.value.trim().toLowerCase() : "",
      };

      var shown = 0;
      [cardWrap, rowWrap].forEach(function (wrap) {
        if (!wrap) return;
        var counted = wrap === cardWrap;
        wrap.querySelectorAll("[data-filterable]").forEach(function (el) {
          var ok = matches(el, state);
          el.hidden = !ok;
          if (ok && counted) shown++;
        });
      });

      sortNodes(cardWrap);
      sortNodes(rowWrap);

      if (countBox) {
        countBox.textContent =
          shown === total
            ? "Showing all " + total + " venues"
            : "Showing " + shown + " of " + total + " venues";
      }
      if (emptyMsg) emptyMsg.style.display = shown === 0 ? "block" : "none";
    };

    boxes.forEach(function (b) {
      b.addEventListener("change", apply);
    });
    [searchBox, capacityBox, sortBox].forEach(function (el) {
      if (!el) return;
      el.addEventListener("input", apply);
      el.addEventListener("change", apply);
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        boxes.forEach(function (b) {
          b.checked = false;
        });
        if (searchBox) searchBox.value = "";
        if (capacityBox) capacityBox.value = "0";
        if (sortBox) sortBox.value = "capacity-desc";
        apply();
      });
    }

    if (viewBtn && tableWrap && cardWrap) {
      viewBtn.addEventListener("click", function () {
        var showTable = cardWrap.hidden === false;
        cardWrap.hidden = showTable;
        tableWrap.hidden = !showTable;
        viewBtn.setAttribute("aria-pressed", String(showTable));
        viewBtn.textContent = showTable ? "Switch to venue cards" : "Switch to comparison table";
      });
    }

    apply();
  }

  /* ---------- Enquiry form validation ---------- */
  var form = document.querySelector("#enquiry-form");
  if (form) {
    var status = form.querySelector(".form-status");

    var setError = function (field, message) {
      var holder = field.closest(".field");
      var slot = holder ? holder.querySelector(".error") : null;
      if (slot) slot.textContent = message;
      field.setAttribute("aria-invalid", message ? "true" : "false");
      return !message;
    };

    var validate = function () {
      var ok = true;

      var required = form.querySelectorAll("[data-required]");
      required.forEach(function (field) {
        var valid = field.value.trim().length > 1;
        if (!setError(field, valid ? "" : "This field is required.")) ok = false;
      });

      var email = form.querySelector("#email");
      if (email) {
        var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        var valid = pattern.test(email.value.trim());
        if (!setError(email, valid ? "" : "Enter a valid email address.")) ok = false;
      }

      var guests = form.querySelector("#guests");
      if (guests && guests.value.trim() !== "") {
        var n = Number(guests.value);
        var valid2 = !isNaN(n) && n > 0 && n < 5000;
        if (!setError(guests, valid2 ? "" : "Enter a guest number between 1 and 5000.")) ok = false;
      }

      return ok;
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      var name = (form.querySelector("#name") || {}).value || "there";
      if (status) {
        status.textContent =
          "Thanks, " +
          name.trim().split(" ")[0] +
          " — your enquiry is ready to send. Connect a form handler (Formspree, Netlify Forms or your own endpoint) to deliver it to the events team.";
        status.classList.add("is-visible");
      }
      form.reset();
      form.querySelectorAll(".error").forEach(function (slot) {
        slot.textContent = "";
      });
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
