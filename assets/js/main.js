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

  /* ---------- Venue filter ---------- */
  var chips = document.querySelectorAll("[data-filter]");
  var items = document.querySelectorAll("[data-tags]");
  var emptyMsg = document.querySelector(".filter-empty");

  if (chips.length && items.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var value = chip.getAttribute("data-filter");

        chips.forEach(function (c) {
          c.setAttribute("aria-pressed", String(c === chip));
        });

        var shown = 0;
        items.forEach(function (item) {
          var tags = (item.getAttribute("data-tags") || "").split(/\s+/);
          var match = value === "all" || tags.indexOf(value) !== -1;
          item.style.display = match ? "" : "none";
          if (match) shown++;
        });

        if (emptyMsg) emptyMsg.style.display = shown === 0 ? "block" : "none";
      });
    });
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
