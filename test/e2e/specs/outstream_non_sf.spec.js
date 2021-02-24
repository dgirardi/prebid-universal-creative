const expect = require('chai').expect;

describe('outstream', function() {
  this.retries(3);
  it('should load outstream non-sf creative', function() {
    browser.url('http://test.localhost:9990/testpages/outstream_non-sf.html');
    browser.pause(6000);
    const elem = $('div[id="div-gpt-ad-1536590534855-0"] > div:nth-child(2) > iframe');
    elem.scrollIntoView();

    // outstream will create two iframes when loaded
    let iframes = $$('div[id="div-gpt-ad-1536590534855-0"] > div:nth-child(2) > iframe')
    expect(iframes.length).to.equal(2);
  });
});