// WEBSCRIPT — WSQL: Spatial Data Fetch
// authored by Peace Thabiwa, SAGEWORKS AI
fetch nodes from products {
where  : revenue
order  : spatial(distance(origin))
limit  : phi ^ 3
map    : orbital(result.count)
radius : phi ^ index * 40
color  : hue(revenue.normalized)
}
