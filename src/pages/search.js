import React, { Component } from "react"
import { StaticQuery, Link } from "gatsby"
import { graphql } from "gatsby"
import { Index } from "elasticlunr"
import { Emojione } from "react-emoji-render"
import Layout from "../components/layout"
import SEO from "../components/seo"
import HeartsAnimation from "../components/Animations/HeartsAnimation"

const types = [
  {
    type: "Article",
    bg: "black",
    text: "white",
  },
  {
    type: "Project",
    bg: "special-blue",
    text: "white",
  },
  {
    type: "Boilerplate",
    bg: "light-blue",
    text: "white",
  },
  {
    type: "Presentation",
    bg: "green",
    text: "white",
  },
  {
    type: "Bio",
    bg: "red",
    text: "white",
  },
  {
    type: "Page",
    bg: "blue",
    text: "white",
  },
]

const linkFromType = (page) => {
  if (page.type === "Presentation") {
    return page.path + "/slides"
  }
  if (page.type === "Article") {
    return "/" + page.path
  }
  return page.path
}
export class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: ``,
      results: [],
    }
  }

  render() {
    return (
      <div>
        <input
          type="text"
          className="input is-dark-blue"
          placeholder="Search articles, projects, presentations and more..."
          value={this.state.query}
          onChange={this.search}
          autoFocus
        />
        <div className="row margin-3-t">
          {this.state.results.map((page) => {
            const colour = types.find((item) => item.type === page.type) || {
              bg: "special-blue",
            }
            return (
              <div className="col-xs-12 margin-5-b grow" key={page.id}>
                <Link to={linkFromType(page)} className="is-grey">
                  <h2 className="margin-0">
                    <Emojione text={page.title} />
                  </h2>
                  <p className="margin-1-tb">
                    <Emojione text={page.desc} />
                  </p>
                  <p className={`margin-0 is-${colour.bg}`}>{page.type}</p>
                </Link>
              </div>
            )
          })}
          {(this.state.query === "Carlota" ||
            this.state.query === "carlota") && (
            <>
              <div className="col-xs-12 ">
                <h1 className="is-hero-menu is-pink-always text-align-center">
                  Love you <Emojione text="❤️" />
                </h1>
              </div>
              <div
                style={{
                  position: "absolute",
                  width: "100vw",
                  height: "100vh",
                  overflow: "hidden",
                  top: 0,
                  left: 0,
                  pointerEvents: "none",
                }}
              >
                <HeartsAnimation />
              </div>
            </>
          )}
          {this.state.query.length > 0 &&
            this.state.results.length === 0 &&
            (this.state.query !== "Carlota" ||
              this.state.query === "carlota") && (
              <div className="col-xs-12 ">
                <h4 className="is-black">
                  No results found matching that search term.
                </h4>
              </div>
            )}
        </div>
      </div>
    )
  }
  getOrCreateIndex = () =>
    this.index ? this.index : Index.load(this.props.searchIndex)

  search = (evt) => {
    const query = evt.target.value
    this.index = this.getOrCreateIndex()
    this.setState({
      query,
      results: this.index
        .search(query, { expand: true })
        .map(({ ref }) => this.index.documentStore.getDoc(ref)),
    })
    // console.log(this.state.results)
  }
}

export default () => {
  return (
    <Layout>
      <SEO title={"Search"} />
      <div className="row container pad-10-t">
        <div className="col-xs-12 pad-2-lr pad-10-b">
          <h1 className="is-hero-sub-menu is-grey margin-0">
            {" "}
            <Emojione text="🔎" /> Site Search
          </h1>
          <StaticQuery
            query={graphql`
              query SearchIndexQuery {
                siteSearchIndex {
                  index
                }
              }
            `}
            render={(data) => (
              <Search searchIndex={data.siteSearchIndex.index} />
            )}
          />
        </div>
      </div>
    </Layout>
  )
}
