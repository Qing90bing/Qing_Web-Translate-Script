export const getTemplate = (trimmedDomain, variableName, currentDate, language) => {
  return `// Target website for translation: ${trimmedDomain}

export const ${variableName} = {
  // Description: A description of this translation configuration.
  description: 'This translation configuration is for the localization of the ${trimmedDomain} website.',

  // Test URL: A URL for developers to test the display effects on the website.
  testUrl: '',

  // Creation Date: The creation date of this translation configuration.
  createdAt: '${currentDate}',
  
  // Language: The language this translation configuration applies to.
  language: '${language}', // Supported languages: zh-cn, zh-tw, zh-hk, etc.

  // Enabled State: Controls whether this translation configuration is enabled.
  enabled: true,

  // Styles (CSS)
  // Supports writing multiple CSS rules.
  styles: [
    // Add styles code here, for example:
    // "body { background-color: #f0f0f0; }",
    // "h1 { color: #333; }"
    // ".rule3 { margin: 10px; }"
  ],

  // Element selectors to be excluded from translation.
  blockedElements: [
    // Add CSS selectors here, for example:
    // '.notranslate',
    // '#header .logo'
  ],

  // Extended translation element selectors.
  // Use this to translate elements that are not automatically translated.
  extendedElements: [
    // Add CSS selectors here, for example:
    // '#dynamic-content',
    // '.custom-widget'
  ],
  
  // Custom attributes to be translated.
  // Add any HTML attribute names here that should be translated.
  // Example: 'data-tip', 'data-title'
  customAttributes: [
    // Add custom attributes here
  ],

  // Custom attributes to be blocked from translation.
  // Add any HTML attribute names here that should not be translated.
  // This list takes precedence over the customAttributes list.
  blockedAttributes: [
    // Add blocked attributes here
    // Example: 'title'
  ],

  // Injected Scripts (JavaScript)
  // Supports writing multiple JS rules. Each rule creates a separate <script> tag injected into the page.
  jsRules: [
    // Add JavaScript code here, for example:
    // "console.log('Rule one');",
    // "alert('Rule two');",
    // "document.title = 'Modified Title';"
  ],

  // Regex-based Translation Rules
  // Rules are automatically applied to matching text.
  // Format: [/original_text_regex/i, 'translated_text']
  // Use $1, $2, ... to reference capture groups in the regex.
  // Example: [/^Hello (\\w+)/, 'Hi $1']
  regexRules: [
    // Add regex rules here
  ],

  // Plain Text Translation Rules
  // Rules match the entire text exactly.
  // Format: ['original_text', 'translated_text']
  // Example: ['Login', 'Sign In']
  textRules: [
    // Add plain text rules here
  ],
};
`;
};