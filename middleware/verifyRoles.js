const jwt = require('jsonwebtoken');

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.sendStatus(401);
        console.log(authHeader);
        const token = authHeader.split(' ')[1];
        
        jwt.verify(
            token,
            'ledgerAppSecretKey',
            (err, decoded) => {
                if (err) return res.sendStatus(403);
                req.user = decoded.username;

                if (!decoded?.role) return res.sendStatus(401);
                const rolesArray = allowedRoles;
                console.log(rolesArray)
                const result = rolesArray.includes(decoded?.role);
                if (!result) return res.sendStatus(401);
                next();
            }
        );
    }
}

module.exports = verifyRoles