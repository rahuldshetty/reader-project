use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct FeedData {
    pub id: i64,
    pub name: String,
    pub text: String,
    pub favicon: String,
    pub posts: Vec<PostData>
}

#[derive(Debug, Serialize)]
pub struct PostData {
    pub title: String,
    pub link: String,
    pub description: String,
    pub pub_date: String,
}


#[derive(Debug)]
pub struct FaviconLink {
    pub href: String,
    pub sizes: String,
}

