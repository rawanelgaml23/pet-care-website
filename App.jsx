const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches

if (!reduceMotion) {
  document.documentElement.classList.add("has-js")

  const textTargets = document.querySelectorAll(
    ".bg h3, .bg p, .servdog h2, .servdog p, .servph h4, .servph p, " +
      ".care h2, .care p, .us h2, .us p, .about h2, .about p, " +
      ".end h2, .end li a, .conus p, .conus a",
  )

  textTargets.forEach((element) => {
    let characterIndex = 0

    const wrapText = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment()
        let visibleText = ""

        const appendVisibleText = () => {
          if (!visibleText) return

          const letter = document.createElement("span")
          letter.className = "typing-char"
          letter.textContent = visibleText
          letter.style.animationDelay = `${characterIndex * 0.008}s`
          characterIndex += 1
          fragment.append(letter)
          visibleText = ""
        }

        Array.from(node.textContent ?? "").forEach((character) => {
          if (/\s/.test(character)) {
            appendVisibleText()
            fragment.append(document.createTextNode(character))
            return
          }
          visibleText += character
        })
        appendVisibleText()

        node.replaceWith(fragment)
        return
      }

      Array.from(node.childNodes).forEach(wrapText)
    }

    Array.from(element.childNodes).forEach(wrapText)
    element.dataset.typing = "true"
  })

  document.querySelectorAll(".bg [data-typing]").forEach((text, index) => {
    text.style.setProperty("--text-delay", `${index * 0.2}s`)
    text.classList.add("is-typing")
  })

  const animatedSections = document.querySelectorAll(
    ".servdog, .servph, .care, .adopt, .about, .end",
  )
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          entry.target.classList.add("is-visible")
          entry.target.querySelectorAll("[data-typing]").forEach((text, index) => {
            text.style.setProperty("--text-delay", `${index * 0.16}s`)
            text.classList.add("is-typing")
          })
          if (entry.target.matches("[data-typing]")) {
            entry.target.classList.add("is-typing")
          }
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.15 },
    )

    animatedSections.forEach((section, index) => {
      section.classList.add("reveal")
      section.style.setProperty(
        "--reveal-delay",
        `${Math.min(index, 3) * 90}ms`,
      )
      revealObserver.observe(section)
    })
  } else {
    animatedSections.forEach((section) => section.classList.add("is-visible"))
    document
      .querySelectorAll("[data-typing]")
      .forEach((text) => text.classList.add("is-typing"))
  }

  document.querySelectorAll(".servph, .card, .bigcard").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return

      const bounds = card.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width
      const y = (event.clientY - bounds.top) / bounds.height
      card.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`)
      card.style.setProperty("--tilt-y", `${(x - 0.5) * 5}deg`)
    })

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg")
      card.style.setProperty("--tilt-y", "0deg")
    })
  })

  document
    .querySelectorAll(".bg .text1 a, .ab a, .catcare a, .us a")
    .forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const bounds = button.getBoundingClientRect()
        button.style.setProperty(
          "--shine-x",
          `${event.clientX - bounds.left}px`,
        )
        button.style.setProperty(
          "--shine-y",
          `${event.clientY - bounds.top}px`,
        )
      })
    })
}
