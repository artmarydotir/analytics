const ImageMimeType = [
  'image/bmp',
  'image/heif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
];

const AudioMimeType = [
  'audio/aac',
  'audio/flac',
  'audio/mp2t',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg',
  'audio/opus',
  'audio/wav',
  'audio/webm',
  'audio/x-matroska',
  'audio/x-realaudio',
  'audio/x-wav',
];

const VideoMimeType = [
  'video/3gpp',
  'video/mp2t',
  'video/mp4',
  'video/mpeg',
  'video/ogg',
  'video/quicktime',
  'video/webm',
  'video/x-flv',
  'video/x-matroska',
  'video/x-ms-asf',
  'video/x-msvideo',
  'video/x-ms-wmv',
];

const DocumentMimeType = [
  'application/epub+zip',
  'application/msonenote',
  'application/msword',
  'application/oebps-package+xml',
  'application/pdf',
  'application/rtf',
  'application/vnd.amazon.mobi8-ebook',
  'application/vnd.ms-excel',
  'application/vnd.ms-excel.addin.macroEnabled.12',
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
  'application/vnd.ms-excel.sheet.macroEnabled.12',
  'application/vnd.ms-excel.template.macroEnabled.12',
  'application/vnd.ms-officetheme',
  'application/vnd.ms-powerpoint',
  'application/vnd.ms-powerpoint.addin.macroEnabled.12',
  'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
  'application/vnd.ms-powerpoint.slide.macroEnabled.12',
  'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
  'application/vnd.ms-powerpoint.template.macroEnabled.12',
  'application/vnd.ms-word.document.macroEnabled.12',
  'application/vnd.ms-word.template.macroEnabled.12',
  'application/vnd.oasis.opendocument.presentation',
  'application/vnd.oasis.opendocument.spreadsheet',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.presentationml.slide',
  'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
  'application/vnd.openxmlformats-officedocument.presentationml.template',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  'application/x-mobipocket-ebook',
  'image/vnd.djvu',
  'image/x-djvu',
  'image/x.djvu',
];

const constants = {
  UNKNOWN: 0,
  IMAGE: 1,
  AUDIO: 2,
  VIDEO: 3,
  DOCUMENT: 4,
};

const list = Object.values(constants);

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'FileType',
  title: 'File Type',
  description: 'Possible list of file type',
  type: 'number',
  enum: list,
};

module.exports = {
  ImageMimeType,
  AudioMimeType,
  VideoMimeType,
  DocumentMimeType,
  constants,
  list,
  schema,
};
