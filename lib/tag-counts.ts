import { slug } from 'github-slugger'
import { allBlogs } from 'contentlayer/generated'

export const POSTS_PER_PAGE = 5

/**
 * Count tags from published posts. Used for static params so deleting an MDX
 * file cannot leave a stale tag-data.json entry that prerenders an empty page.
 */
export function getTagCounts(): Record<string, number> {
  const tagCount: Record<string, number> = {}
  for (const post of allBlogs) {
    if (!post.tags) continue
    if (process.env.NODE_ENV === 'production' && post.draft === true) continue
    for (const tag of post.tags) {
      const formattedTag = slug(tag)
      tagCount[formattedTag] = (tagCount[formattedTag] ?? 0) + 1
    }
  }
  return tagCount
}

export function getTagStaticParams() {
  return Object.keys(getTagCounts()).map((tag) => ({
    tag: encodeURI(tag),
  }))
}

export function getTagPaginatedStaticParams() {
  const tagCounts = getTagCounts()
  return Object.keys(tagCounts).flatMap((tag) => {
    const postCount = tagCounts[tag]
    const totalPages = Math.max(1, Math.ceil(postCount / POSTS_PER_PAGE))
    return Array.from({ length: totalPages }, (_, i) => ({
      tag: encodeURI(tag),
      page: (i + 1).toString(),
    }))
  })
}
