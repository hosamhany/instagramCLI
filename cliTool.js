const program = require('commander');
const instagramApi = require ('./instagramPrivateApi/instagramApi')
const prompt = require('prompt');
const schema = require ('./utils/validations/promptValidations')

program
    .version('0.0.1')
    .description('instagram cli tool');
//this updates the session of the user
program
    .command('getFollowers')
    .alias('gf')
    .description('gets the followers of the account input')
    .action(() => {
            prompt.start();
            console.log("Please login..")
            
            prompt.get(schema.schema, function (err, result) {
                console.log("Fetching saschafirtina's followers");
                instagramApi.createSession(result.username, result.password);
            })

    });

program.parse(process.argv);
