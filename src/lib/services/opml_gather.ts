export const parseFeedDatafromOPML = (opmlString: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(opmlString, "text/xml");

    const items = [];
    let index = 1;

    function traverseOutlines(outlines) {
        outlines.forEach(outline => {
            if (outline.hasAttribute("xmlUrl")) {
                items.push({
                    name: outline.getAttribute("text") || "",
                    xmlUrl: outline.getAttribute("xmlUrl") || "",
                });
            } else {
                const childOutlines = outline.querySelectorAll(":scope > outline");
                traverseOutlines(childOutlines);
            }
        });
    }

    const topLevelOutlines = xmlDoc.querySelectorAll("body > outline");
    traverseOutlines(topLevelOutlines);

    return items;
}
