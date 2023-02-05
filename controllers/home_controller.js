module.exports.home = (req, res) => {
    if (req.user) {
        var logged_in_user = req.user._id;
    } else {
        var logged_in_user_id = "";
    }
    res.render('home', {
        logged_in_user_id: logged_in_user
    });
}