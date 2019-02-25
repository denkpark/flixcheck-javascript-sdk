const flixcheck = require("../index");
const fs = require("fs");

const userId = process.env.FLIXCHECK_TEST_USER_ID;
const apiKey = process.env.FLIXCHECK_TEST_API_KEY;
const testCheckId = process.env.FLIXCHECK_TEST_CHECK_ID;
const testAccountId = process.env.FLIXCHECK_TEST_ACCOUNT_ID;
const testFileId = process.env.FLIXCHECK_TEST_FILE_ID;
const testFileImageId = process.env.FLIXCHECK_TEST_FILE_IMAGE_ID;

const client = new flixcheck.FlixcheckClient(userId, apiKey, {
    endpoint: process.env.FLIXCHECK_TEST_ENDPOINT
});

async function test() {
    try {

        /* Test getCheck */
        const check = await client.getCheck(testCheckId);
        console.log("Check subject", check.subject);

        /* Test getCheckPdf */
        const pdfBuffer = await client.getCheckPdf(testCheckId);
        fs.writeFileSync(__dirname + "/check.pdf", pdfBuffer);

        /* Test putCheck */
        await client.putCheck(testCheckId, {
            notes: "Great!"
        });
        const checkAfterUpdate = await client.getCheck(testCheckId);
        console.log("Check notes (should be \"Great!\")", checkAfterUpdate.notes);

        /* Test getAccount */
        const account = await client.getAccount(testAccountId);
        console.log("Company name", account.company.name);

        /* Test getFileMetadata */
        const fileMetadata = await client.getFileMetadata(testFileImageId);
        console.log("File metadata", fileMetadata);

        /* Test getFile */
        const fileBuffer = await client.getFile(testFileId);
        fs.writeFileSync(__dirname + "/file.pdf", fileBuffer);

        /* Test reportError */
        await client.reportError("Test-Error", testErrorStack, {
            exampleMoreInfo1: true,
            exampleMoreInfo2: "exampleValue",
            exampleMoreInfo3: 123
        });

    } catch (error) {
        throw error;
    }
}

test()
    .then(() => {
        // process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });



const testErrorStack = `ERROR: Test-Error
  at someFunction.js:45
  at someOtherFunction.js:12`;