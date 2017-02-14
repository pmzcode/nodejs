const express = require('express');
var passport = require('passport');
module.exports = (authService, config) => {
    const router = express.Router();

    router.post('/login', (req, res) => {
        authService.login(req.body)
            .spread((userId,userRole) => {
                res.cookie(config.cookie.auth, userId, { signed: true });
                res.cookie(config.cookie.roleName,userRole);
                res.redirect("/panel.html");
            })
            .catch((err) => res.error(err));
    });

    router.post('/register', (req, res) => {
        authService.register(req.body)
                .then((user) => res.redirect("/panel.html"))
            .catch((err) => res.error(err));
    });
    router.post('/logout', (req, res) => {
        res.cookie(config.cookie.auth, '');
        res.cookie(config.cookie.roleName,'');
        res.redirect("/index.html")
    });

// LAB 7 methods
    router.get('/login/twitter', passport.authenticate('twitter', { failureRedirect: '/error.html' }));

    router.get('/login/twitter/return', passport.authenticate('twitter', { failureRedirect: '/error.html' }),
        (req, res) => {
            console.log(req.user);
            if (req.user){
                authService.loginTwitter(req.user)
                    .spread((userId,userRole) => {
                        res.cookie(config.cookie.auth, userId, { signed: true });
                        res.cookie(config.cookie.roleName,userRole);
                        res.redirect("/panel.html");
                    })
                    .catch((err) => res.error(err));
            }
            else
            res.redirect('/');
        });

    router.get('/login/profile', require('connect-ensure-login').ensureLoggedIn(),
        (req, res) => {
            console.log(req.user);
            res.redirect('/panel.html');
        });


    return router;
};