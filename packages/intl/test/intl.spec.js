const { Intl, MissingLocale, InvalidLocaleMessage } = require('../index')

let locales = {
  'en-us': {
    welcome: 'Welcome {name}',
    messages: `You have {messages, plural, =0 {no messages} one {1 message} other {{messages} messages}}`,
    first: { second: { third: `Hi {name} from deep nested key` }}
  },
  'sq-al': {
    welcome: 'Miresevjen {name}',
    messages: `Ju {messages, plural, =0 {s'keni asnje mesazh} one {keni 1 mesazh} other {keni {messages} mesazhe}}`
  }
}

test('key is found and formatted correctly', () => {
  const intl = new Intl(locales, 'en-us')
  const message = intl.format('welcome', { name: 'John' })

  expect(message).toBe('Welcome John')
})

test('deep nested key is found and formatted correctly', () => {
  const intl = new Intl(locales, 'en-us')
  const message = intl.format('first.second.third', { name: 'John' })

  expect(message).toBe('Hi John from deep nested key')
})

test('returns null when key is not found', () => {
  const intl = new Intl(locales, 'en-us')
  const message = intl.format('not.found', { name: 'John' })

  expect(message).toBeNull()
})

test('locale is changed after initialization', () => {
  const intl = new Intl(locales, 'en-us')
  const messageEn = intl.format('welcome', { name: 'John' })
  intl.locale = 'sq-al'
  const messageSq = intl.format('welcome', { name: 'Xhon' })

  expect(messageEn).toBe('Welcome John')
  expect(messageSq).toBe('Miresevjen Xhon')
})

test('locale is changed temporarily for a single format call', () => {
  const intl = new Intl(locales, 'en-us')
  const messageEn = intl.format('welcome', { name: 'John' })
  const messageSq = intl.in('sq-al').format('welcome', { name: 'Xhon' })

  expect(messageEn).toBe('Welcome John')
  expect(messageSq).toBe('Miresevjen Xhon')
})

test('locale is reported correctly', () => {
  const intl = new Intl(locales, 'en-us')
  expect(intl.locale).toBe('en-us')
})

test('unfound locale key is retrieved from fallback', () => {
  const intl = new Intl(locales, 'sq-al', 'en-us')
  const message = intl.format('first.second.third', { name: 'John' })

  expect(message).toBe('Hi John from deep nested key')
})

test("throws when locale doesn't exist", () => {
  expect(() => {
    const intl = new Intl(locales, 'en-us')
    intl.locale = 'fr'
    intl.format('welcome', { name: 'John' })
  }).toThrow(MissingLocale)

  expect(() => {
    const intl = new Intl(locales, 'en-us')
    intl.in('fr').format('welcome', { name: 'John' })
  }).toThrow(MissingLocale)
})

test("throws when fallback locale doesn't exist", () => {
  expect(() => {
    const intl = new Intl(locales, 'en-us', 'fr')
    intl.format('not.found', { name: 'John' })
  }).toThrow(MissingLocale)
})

test('throws when locale message is not correctly formatted', () => {
  expect(() => {
    locales['en-us'].welcome = 'Welcome {{name}'
    const intl = new Intl(locales, 'en-us')
    intl.format('welcome', { name: 'John' })
  }).toThrow(InvalidLocaleMessage)
})
