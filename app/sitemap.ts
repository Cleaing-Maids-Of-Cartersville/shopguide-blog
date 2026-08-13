import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { getTagCounts } from '@/lib/tag-counts'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl
  const today = new Date().toISOString().split('T')[0]

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  const tagRoutes = Object.keys(getTagCounts()).map((tag) => ({
    url: `${siteUrl}/tags/${tag}`,
    lastModified: today,
  }))

  const routes = ['', 'blog', 'tags', 'about', 'newsletter', 'integrations'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: today,
  }))

  return [...routes, ...blogRoutes, ...tagRoutes]
}
