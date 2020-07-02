/* eslint-disable jsx-a11y/heading-has-content*/

import { Link } from "gatsby"
import React, { useRef, useEffect, useState } from "react"
import useDarkMode from "use-dark-mode"
import LogoAnimation from "./Animations/LogoAnimation"
import SmoothCollapse from "react-smooth-collapse"
import sections from "../data/nav-sections.json"
import { NavLinkSmall } from "./Root/NavLink"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import SpamButton from "../utils/SpamButton"

function useOutsideAlerter(ref, fn) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        fn(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, fn])
}

function freakOut() {
  document.body.classList.add("freak-out")
  setTimeout(() => document.body.classList.remove("freak-out"), 5000)
}

export default () => {
  const darkMode = useDarkMode(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef, setMenuOpen)

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (menuOpen) {
        setMenuOpen(false)
      }
    })
  })

  const delay = (fn) => {
    fn()
  }

  return (
    <div
      className="is-white-bg is-grey pad-5 "
      style={{ zIndex: 1000 }}
      ref={wrapperRef}
    >
      <div className="row flex padding-0-tb container-small">
        <div className="col-xs-9 flex">
          <Link
            to="/"
            title="home"
            className=" align-horizontal is-white flex grow-on-hover"
            style={{ textDecoration: "none" }}
          >
            <LogoAnimation darkMode={darkMode.value} />
          </Link>
        </div>
        <div
          className="col-xs-3 flex text-align-right"
          style={{ justifyContent: "flex-end", alignItems: "center" }}
        >
          <button
            type="button"
            aria-label="light mode"
            onClick={() => {
              setMenuOpen(false)
              trackCustomEvent({
                category: "Dark Mode",
                action: "Click",
                label: "Dark Mode Toggle Button",
              })
              delay(darkMode.value ? darkMode.disable : darkMode.enable)
            }}
          >
            <h2
              className={`las la-adjust link margin-0 rotate-icon ${
                darkMode.value ? "rotate-dark" : "rotate-light"
              }`}
              style={{ fontSize: 30 }}
            ></h2>
          </button>

          <SpamButton
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            onSpam={() => {
              trackCustomEvent({
                category: "Egg Trigger",
                action: "Click",
                label: "Egg-Nav",
              })
              freakOut()
            }}
            clicks={8}
            interval={2000}
          >
            <h2
              className={`las ${
                !menuOpen ? "la-bars" : "la-times-circle"
              } link margin-0 margin-2-l`}
              style={{ fontSize: 30 }}
            ></h2>
          </SpamButton>
        </div>
        <div className="col-xs-12 pad-0">
          <SmoothCollapse expanded={menuOpen} className="">
            <div className="row margin-3-t">
              {sections
                .filter((item) => item.nav)
                .sort(function (a, b) {
                  if (a.type < b.type) {
                    return -1
                  }
                  if (a.type > b.type) {
                    return 1
                  }
                  return 0
                })
                .map((item) => (
                  <div className="col-xs-6 col-md-3 col-lg-2" key={item.label}>
                    <NavLinkSmall {...item} key={item.label} />
                  </div>
                ))}
            </div>
          </SmoothCollapse>
        </div>
      </div>
    </div>
  )
}
