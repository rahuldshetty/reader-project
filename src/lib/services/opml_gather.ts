import type { FeedMetadata, FeedMetadataFolder, FeedResult } from "$lib/types";
import { fetchFeedDataFromFeedURL } from "./feed_gather";
import { asyncPool } from "$lib/utils/async_job";
import { FEED_TYPE } from "$lib/constants";

// returns both the flat list of [index, url] *and* how many URLs we found
function gatherXmlUrls(
  outlines: NodeListOf<Element>,
  startIndex: number,
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


function gatherFeedData(
  outlines: NodeListOf<Element>,
  startIndex: number,
): { items: FeedMetadata[]; urlCount: number } {
  const items: FeedMetadata[] = []
  let count = 0;

  function recurse_feed(outlines: NodeListOf<Element>) {
    for (const o of outlines) {
      if (o.hasAttribute("xmlUrl")) {
        const name = o.getAttribute("text") ?? o.getAttribute("title") ?? ""
        const url = o.getAttribute("xmlUrl")!
        items.push({
          icon: '',
          id: startIndex + count,
          name: name,
          url: url,
          posts: [],
          type: FEED_TYPE.FEED,
        })
        count++
      } else {
        recurse_feed(o.querySelectorAll(":scope > outline"))
      }
    }
  }

  recurse_feed(outlines)
  return { items, urlCount: count }
}

export const parseFeedDatafromOPML = async (opmlString: string, skip_loading_data: boolean) => {
  const doc = new DOMParser().parseFromString(opmlString, "text/xml")
  const top = doc.querySelectorAll("body > outline")
  const out: (FeedMetadata | FeedMetadataFolder)[] = []
  let index = 0

  for (const o of top) {
    if (o.hasAttribute("xmlUrl")) {
      // Handle Feed
      const name = o.getAttribute("text") ?? o.getAttribute("title") ?? ""
      const url = o.getAttribute("xmlUrl")!

      // Skip loading data based on user selection
      if (skip_loading_data) {
        out.push({
          id: index,
          icon: '',
          name: name,
          url: url,
          type: FEED_TYPE.FEED,
          posts: [],
        });
      } else {
        out.push(await fetchFeedDataFromFeedURL(index, url));
      }
      index++
    } else {
      // Handle Folder
      const name = o.getAttribute("text") ?? o.getAttribute("title") ?? ""
      const childrenOutlines = o.querySelectorAll(":scope > outline")

      if (skip_loading_data) {
        // 1) gather URLs *and* how many we found
        const { items: children, urlCount } = gatherFeedData(childrenOutlines, index + 1);

        // 2) emit the folder
        out.push({ id: index, name, children, type: FEED_TYPE.FOLDER })

        // 3) bump index: skip folder slot + all URLs we found
        index = index + 1 + urlCount

      } else {
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
  }

  return {
    "items": out, 
    "size": index
  };
}


export const convertFeedDataToOPML = (feed_data: FeedResult[]) => {
    let opml_body = "";

    for(const feed of feed_data){
        console.log(feed);
        if(feed.type == FEED_TYPE.FOLDER){
            if(feed.children){
                opml_body += `\t\t<outline text="${feed.title}">\n`
                for(const child_feed of feed.children){
                    opml_body += `\t\t\t\t<outline text="${child_feed.title}" xmlUrl="${child_feed.url}"/>\n`
                }
                opml_body += `\t\t</outline>\n`
            }
        } else{
            opml_body += `\t\t<outline text="${feed.title}" xmlUrl="${feed.url}"/>\n`
        }
    }

    return `<opml version="1.0">\t\n<body>\n${opml_body}\t</body>\n</opml>`;
}