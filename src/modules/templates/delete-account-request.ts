export const deleteAccountRequest = (
    name: string,
    email: string
) => `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Delete Account Request</title>
    </head>
    <body>
        User ${name}, having email ${email} has requested to delete their
        account.
    </body>
</html>
`;
