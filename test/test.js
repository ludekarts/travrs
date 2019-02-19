import {Selector} from "testcafe";

fixture("travrs tests").page("./index.html");

test("Page should contain \"travrs\" in global scope", async browser => {
  const travrs = Selector(() => window.travrs ? document.querySelector("body") : null);  
  await browser.expect(travrs.exists).eql(true);
});
