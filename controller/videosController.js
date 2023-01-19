export const search = (req, res) => {
    return res.send("<h1>HERE IS SEARCHPAGE</h1>")
};
export const see = (req, res) => {
    return res.send(`<h1>HERE IS watchVideoPAGE ${req.params.id}</h1>`)
};
export const edit = (req, res) => {
    return res.send("<h1>HERE IS editVideoPAGE</h1>")
};
export const remove = (req, res) => {
    return res.send("<h1>HERE IS deleteVideoPAGE</h1>")
};
export const upload = (req, res) => {
    return res.send("<h1>HERE IS uploadVideoPAGE</h1>")
};
