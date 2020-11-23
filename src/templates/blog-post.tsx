import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

type BlogPostBySlugQuery = {
  readonly site: GatsbyTypes.Maybe<{
    readonly siteMetadata: GatsbyTypes.Maybe<
      Pick<GatsbyTypes.SiteSiteMetadata, "title">
    >
  }>
  readonly markdownRemark: GatsbyTypes.Maybe<
    Pick<GatsbyTypes.MarkdownRemark, "id" | "excerpt" | "html"> & {
      readonly frontmatter: Pick<
        GatsbyTypes.Frontmatter,
        "title" | "date" | "description"
      >
    }
  >
  readonly previous: GatsbyTypes.Maybe<{
    readonly fields: GatsbyTypes.Maybe<Pick<GatsbyTypes.Fields, "slug">>
    readonly frontmatter: GatsbyTypes.Maybe<
      Pick<GatsbyTypes.Frontmatter, "title">
    >
  }>
  readonly next: GatsbyTypes.Maybe<{
    readonly fields: GatsbyTypes.Maybe<Pick<GatsbyTypes.Fields, "slug">>
    readonly frontmatter: GatsbyTypes.Maybe<
      Pick<GatsbyTypes.Frontmatter, "title">
    >
  }>
}

export interface Props {
  data: BlogPostBySlugQuery
  location: Location
}

const BlogPostTemplate: React.FC<Props> = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site?.siteMetadata?.title || `Title`
  const { previous, next } = data

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post?.frontmatter.title || ``}
        description={post?.frontmatter.description || post?.excerpt}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post?.frontmatter.title}</h1>
          <p>{post?.frontmatter.date}</p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post?.html || `` }}
          itemProp="articleBody"
        />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields?.slug || ``} rel="prev">
                ← {previous.frontmatter?.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields?.slug || ``} rel="next">
                {next.frontmatter?.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
