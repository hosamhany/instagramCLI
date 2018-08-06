const program = require('commander');
const instagramApi = require ('./instagramPrivateApi/instagramApi')
const prompt = require('prompt');
const schema = require ('./utils/validations/promptValidations')


program
    .version('0.0.1')
    .description('instagram cli tool');

// function login(){
    program
        .command('help')
        .alias('a')
        .description('help')
        .action(() => {
                prompt.start();
                console.log("Please login..")
                prompt.get(schema.schema, function (err, result) {
                    if(err){
                        console.log('\x1b[31m', "An error has occured, please try again later.." )
                    }
                    instagramApi.createSession(result.username, result.password)
                });           
        });
// }

function help () {
    console.log("help")
}

program.parse(process.argv);
