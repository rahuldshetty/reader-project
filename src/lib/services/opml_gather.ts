import type { FeedMetadata, FeedMetadataFolder} from "$lib/types";
import { fetchFeedDataFromFeedURL } from "./feed_gather";
import { asyncPool } from "$lib/utils/async_job";
import { FEED_TYPE } from "$lib/constants";

// returns both the flat list of [index, url] *and* how many URLs we found
function gatherXmlUrls(
  outlines: NodeListOf<Element>,
  startIndex: number
): { items: [number, string][]; urlCount: number } {
  const items: [number, string][] = []
  let count = 0

  function recurse(outlines: NodeListOf<Element>) {
    for (const o of outlines) {
      if (o.hasAttribute("xmlUrl")) {
        const url = o.getAttribute("xmlUrl")!
        items.push([startIndex + count, url])
        count++
      } else {
        recurse(o.querySelectorAll(":scope > outline"))
      }
    }
  }

  recurse(outlines)
  return { items, urlCount: count }
}

export const parseFeedDatafromOPML = async (opmlString: string) => {
  const doc = new DOMParser().parseFromString(opmlString, "text/xml")
  const top = doc.querySelectorAll("body > outline")
  const out: (FeedMetadata | FeedMetadataFolder)[] = []
  let index = 0

  for (const o of top) {
    if (o.hasAttribute("xmlUrl")) {
      const url = o.getAttribute("xmlUrl")!
      out.push(await fetchFeedDataFromFeedURL(index, url))
      index++
    } else {
      const name = o.getAttribute("text") ?? o.getAttribute("title") ?? ""
      const childrenOutlines = o.querySelectorAll(":scope > outline")

      // 1) gather URLs *and* how many we found
      const { items: flatList, urlCount } = gatherXmlUrls(childrenOutlines, index + 1)

      // 2) fetch them
      const children = await asyncPool(10, flatList, fetchFeedDataFromFeedURL)

      // 3) emit the folder
      out.push({ id: index, name, children, type: FEED_TYPE.FOLDER })

      // 4) bump index: skip folder slot + all URLs we found
      index = index + 1 + urlCount
    }
  }
  return out
}