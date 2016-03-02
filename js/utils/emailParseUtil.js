import * as emailSignatureParser from './emailSignatureParser.js'
import cheerio from 'cheerio'

export default (function() {

    'use strict';

    let extractSignature = emailSignatureParser.extractSignature;

    /**
    * Emails often come with copies of old emails from earlier in the thread
    * We don't want to process the old emails when we're analysing as we'll have a false positive otherwise
    **/             
    function removeQuotedTextFromEmail (emailContents) {

        const html = /<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/i.test(emailContents) 
        let processedEmail
        
        if(html){
            let $ = cheerio.load(emailContents);
            processedEmail = $('td').find(">:first-child").text();
        }else{
            let strippedHTML = stripHTML(emailContents);
            processedEmail = extractSignature(strippedHTML).text || emailContents;
        }

        return processedEmail;
    }

    function stripHTML(message) {
        return message.replace(/<(?:.|\n)*?>/gm, '');
    }

    return {
        removeQuotedTextFromEmail
    }

})();

