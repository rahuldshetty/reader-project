import Parser from "@postlight/parser";

export const mercury_parser = async (url: string, html_page: string) => {
    console.log("Trying to parse with mercury...");

    try {
        const document = await Parser.parse(url, {
            html: html_page,
        });
        console.log("Parsed Result:");
        console.log(document);
        return document;
    } catch (error) {
        console.log("Parse FAILED")
        console.log(error)
        console.error(JSON.stringify(error));
    }

    return null;
}
