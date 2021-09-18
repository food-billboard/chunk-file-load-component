import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Upload as ChunkUpload } from 'chunk-file-upload';
import { Upload } from '../../src';
import {
  exitDataFn,
  uploadFn,
  completeFn,
  sleep,
  uploadTask,
  FILE_SIZE,
  FILE_NAME,
  FILE_TYPE,
  deleteTask,
  stopTask,
  previewTask,
} from './utils';
import {
  MOCK_COMPLETE_STRING_FILE,
  MOCK_COMPLETE_OBJECT_FILE,
} from './constants';

const DEFAULT_REQUEST = {
  exitDataFn,
  uploadFn,
  completeFn,
  callback: () => {},
};

const isValidUrlFile = (files, partial, another) => {
  const realFiles = Array.isArray(files) ? files : [files];
  realFiles.forEach((file) => {
    if (typeof file === 'string') return;
    partial && !!file.id && expect(typeof file.id).toEqual('string');
    partial && !!file.local && expect(typeof file.local).toEqual('object');
    partial &&
      !!file.local &&
      !!file.local.type &&
      expect(file.local.type).toEqual('url');
    partial &&
      !!file.local &&
      !!file.local.value &&
      expect(typeof file.local.value).toEqual('object');
    partial &&
      !!file.local &&
      !!file.local.value &&
      !!file.local.value.fileId &&
      expect(typeof file.local.value.fileId).toEqual('string');
    partial &&
      !!file.getStatus &&
      expect(file.getStatus).toBeInstanceOf(Function);
    partial &&
      !!file.getStatus &&
      expect(typeof file.getStatus()).toEqual('number');
    another && another(file);
  });
};

const isUploadValidFile = (files, another) => {
  const realFiles = Array.isArray(files) ? files : [files];
  realFiles.forEach((file) => {
    expect(file.originFile).toBeInstanceOf(File);
    expect(typeof file.id).toEqual('string');
    expect(typeof file.local).toEqual('object');
    expect(file.local.type).toEqual('local');
    expect(typeof file.local.value).toEqual('object');
    expect(typeof file.local.value.fileId).toEqual('string');
    expect(typeof file.local.value.filename).toEqual('string');
    expect(typeof file.local.value.fileSize).toEqual('number');
    expect(typeof file.task).toEqual('object');
    expect(typeof file.name).toEqual('symbol');
    if (file.originFile.type.startsWith('image')) {
      expect(file.local.value.preview).toBeDefined();
    }
    expect(file.getStatus).toBeInstanceOf(Function);
    expect(typeof file.getStatus()).toEqual('number');
    another && another(file);
  });
};

describe(`Upload Component test`, () => {
  describe('defaultValue test', () => {
    it(`defaultValue set string`, async () => {
      const props = {
        viewType: 'list',
        defaultValue: MOCK_COMPLETE_STRING_FILE,
        request: DEFAULT_REQUEST,
      };

      const ref = React.createRef();

      mount(<Upload ref={ref} {...props} />);

      const files = ref.current.getFiles(true);
      expect(files.length).toEqual(1);
      isValidUrlFile(files);
    });

    it(`defaultValue set string[]`, () => {
      const props = {
        viewType: 'list',
        defaultValue: [MOCK_COMPLETE_STRING_FILE],
        request: DEFAULT_REQUEST,
      };

      const ref = React.createRef();

      mount(<Upload ref={ref} {...props} />);

      const files = ref.current.getFiles(true);
      expect(files.length).toEqual(1);
      isValidUrlFile(files);
    });

    it(`defaultValue set PartialWrapperFile`, () => {
      const name = MOCK_COMPLETE_OBJECT_FILE.name;
      const testName = MOCK_COMPLETE_OBJECT_FILE.local.value.filename;

      const props = {
        viewType: 'list',
        defaultValue: [MOCK_COMPLETE_OBJECT_FILE],
        request: DEFAULT_REQUEST,
      };

      const ref = React.createRef();

      mount(<Upload ref={ref} {...props} />);

      const files = ref.current.getFiles(true);
      expect(files.length).toEqual(1);
      isValidUrlFile(files, false, (file) => {
        expect(file.name).toEqual(name);
        expect(file.local.value.filename).toEqual(testName);
      });
    });
  });

  describe('value test', () => {
    it(`value set string`, async () => {
      await new Promise(async (resolve, reject) => {
        let changeValue = [MOCK_COMPLETE_STRING_FILE];
        const ref = React.createRef();

        const props = {
          viewType: 'list',
          onChange: (value) => {
            const files = ref.current.getFiles(true);
            expect(files.length).toEqual(1);
            const [formatCompleteFile] = files;
            expect(typeof formatCompleteFile).toEqual('object');
            isValidUrlFile(formatCompleteFile);
            if (value.length === 2) {
              expect(value).toBeInstanceOf(Array);
              expect(value.length).toEqual(2);
              const [completeFile, uploadFile] = value;
              isValidUrlFile(completeFile);
              isUploadValidFile(uploadFile);
              resolve();
            }
          },
          value: changeValue,
          request: {
            exitDataFn,
            uploadFn,
            completeFn,
          },
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          await sleep(100);
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);
        });
      });
    });

    it(`value set PartialWrapperFile`, async () => {
      await new Promise(async (resolve, reject) => {
        let changeValue = [MOCK_COMPLETE_OBJECT_FILE];
        const ref = React.createRef();

        const props = {
          viewType: 'list',
          onChange: (value) => {
            const files = ref.current.getFiles(true);
            expect(files.length).toEqual(1);
            const [formatCompleteFile] = files;
            expect(typeof formatCompleteFile).toEqual('object');
            isValidUrlFile(formatCompleteFile);
            if (value.length === 2) {
              expect(value).toBeInstanceOf(Array);
              expect(value.length).toEqual(2);
              const [completeFile, uploadFile] = value;
              isValidUrlFile(completeFile, true);
              isUploadValidFile(uploadFile);
              resolve();
            }
          },
          value: changeValue,
          request: {
            exitDataFn,
            uploadFn,
            completeFn,
          },
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          await sleep(100);
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);
        });
      });
    });
  });

  describe('onChange test', () => {
    it(`onChange set`, async () => {
      await new Promise(async (resolve, reject) => {
        const ref = React.createRef();

        const props = {
          viewType: 'list',
          onChange: (value) => {
            try {
              expect(value).toBeInstanceOf(Array);
              expect(value.length).toEqual(1);
              isUploadValidFile(value);
            } catch (err) {
              reject(err);
            }
            resolve();
          },
          request: {
            exitDataFn,
            uploadFn,
            completeFn,
          },
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);
        });
      });
    });
  });

  describe('onValidator test', () => {
    it(`onValidator fulfilled test`, async () => {
      await new Promise(async (resolve, reject) => {
        const message = 'message-error';
        const ref = React.createRef();

        const props = {
          viewType: 'list',
          onValidator(errorFile, fulFile) {
            expect(errorFile).toBeInstanceOf(Array);
            expect(errorFile.length).toEqual(0);
            expect(fulFile).toBeInstanceOf(Array);
            expect(fulFile.length).toEqual(1);
            resolve();
          },
          validator: (file) => {
            const type = file.type;
            return type.startsWith('image')
              ? null
              : {
                  message,
                  code: 'file-invalid-type',
                };
          },
          request: {
            exitDataFn,
            uploadFn,
            completeFn,
          },
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          await sleep(100);
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);
        });
      });
    });

    it(`onValidator rejected test`, async () => {
      await new Promise(async (resolve, reject) => {
        const message = 'message-error';
        const ref = React.createRef();

        const props = {
          viewType: 'list',
          onValidator(errorFile, fulFile) {
            expect(errorFile).toBeInstanceOf(Array);
            expect(errorFile.length).toEqual(1);
            errorFile.forEach((item) => {
              expect(typeof item).toEqual('object');
              expect(item.file).toBeInstanceOf(File);
              expect(item.errors).toBeInstanceOf(Array);
              expect(item.errors.length).not.toBe(0);
              expect(
                item.errors.some((error) => {
                  expect(typeof error).toEqual('object');
                  return (
                    error.message === message &&
                    error.code === 'file-invalid-type'
                  );
                }),
              ).toBeTruthy();
            });
            expect(fulFile).toBeInstanceOf(Array);
            expect(fulFile.length).toEqual(0);
            resolve();
          },
          validator: (file) => {
            const type = file.type;
            return type.startsWith('video')
              ? null
              : {
                  message,
                  code: 'file-invalid-type',
                };
          },
          request: {
            exitDataFn,
            uploadFn,
            completeFn,
          },
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          await sleep(100);
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);
        });
      });
    });
  });

  describe('onRemove test', () => {
    it(`onRemove return false test`, async () => {
      await new Promise(async (resolve, reject) => {
        const ref = React.createRef();

        const props = {
          viewType: 'list',
          onRemove() {
            return false;
          },
          request: {
            exitDataFn,
            uploadFn,
            completeFn,
          },
          immediately: false,
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          await sleep(100);
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);

          wrapper.update();

          uploadTask(wrapper);
          deleteTask(wrapper);

          setTimeout(() => {
            const files = ref.current.getFiles();
            expect(files.length).toEqual(1);
            resolve();
          }, 100);

          await sleep(1000);
        });
      });
    });

    it(`onRemove return true test`, async () => {
      await new Promise(async (resolve, reject) => {
        const ref = React.createRef();

        const props = {
          viewType: 'list',
          onRemove() {
            return true;
          },
          request: {
            exitDataFn,
            uploadFn,
            completeFn,
          },
          immediately: false,
        };

        let wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          await sleep(100);
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(100);

          wrapper = wrapper.update();

          uploadTask(wrapper);

          await sleep(100);

          deleteTask(wrapper);

          wrapper.update();

          await sleep(100);

          const files = ref.current.getFiles();
          expect(files.length).toEqual(0);

          await sleep(1500);

          resolve();
        });
      });
    });

    it(`onRemove return Promise boolean test`, async () => {
      await new Promise(async (resolve) => {
        const ref = React.createRef();

        const props = {
          viewType: 'list',
          onRemove: async () => {
            await sleep(100);
            return true;
          },
          request: {
            exitDataFn,
            uploadFn,
            completeFn,
          },
          immediately: false,
        };

        let wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          await sleep(100);
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);

          wrapper = wrapper.update();

          uploadTask(wrapper);

          deleteTask(wrapper);

          wrapper.update();

          await sleep(100);

          expect(ref.current.getFiles().length).toEqual(1);

          await sleep(1500);

          expect(ref.current.getFiles().length).toEqual(0);

          await sleep(100);

          resolve();
        });
      });
    });

    it(`onRemove return unValid value test`, async () => {
      await new Promise(async (resolve) => {
        const ref = React.createRef();

        const props = {
          viewType: 'list',
          onRemove: async () => {
            await sleep(100);
            return null;
          },
          request: {
            exitDataFn,
            uploadFn,
            completeFn,
          },
          immediately: false,
        };

        let wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          await sleep(100);
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);

          wrapper = wrapper.update();

          uploadTask(wrapper);

          deleteTask(wrapper);

          wrapper.update();

          await sleep(100);

          expect(ref.current.getFiles().length).toEqual(1);

          await sleep(1500);

          expect(ref.current.getFiles().length).toEqual(0);

          await sleep(100);

          resolve();
        });
      });
    });

    it(`onRemove return reject test`, async () => {
      await new Promise(async (resolve) => {
        const ref = React.createRef();

        const props = {
          viewType: 'list',
          onRemove: async () => {
            await sleep(100);
            return Promise.reject('test error');
          },
          request: {
            exitDataFn,
            uploadFn,
            completeFn,
          },
          immediately: false,
        };

        let wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          await sleep(100);
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);

          wrapper = wrapper.update();

          uploadTask(wrapper);

          deleteTask(wrapper);

          wrapper.update();

          await sleep(100);

          expect(ref.current.getFiles().length).toEqual(1);

          await sleep(1500);

          expect(ref.current.getFiles().length).toEqual(1);

          await sleep(100);

          resolve();
        });
      });
    });
  });

  describe('itemRender test', () => {
    it(`itemRender return newElement test`, async () => {
      const defineItemNodeClass = 'defineItemNodeClass';

      const ref = React.createRef();
      let removeDone = false;
      let previewDone = false;
      let readIndex = 0;
      let uploadIndex = 0;

      const props = {
        viewType: 'list',
        immediately: false,
        onRemove() {
          removeDone = true;
          return false;
        },
        onPreviewFile() {
          previewDone = true;
          return true;
        },
        itemRender: (originNode, file, fileList, action, info) => {
          const { preview, upload, cancel, stop } = action;
          const { complete, status, total } = info;
          expect(originNode).toBeDefined();
          expect(typeof file).toEqual('object');
          expect(Array.isArray(fileList)).toBeTruthy();
          expect(fileList.length).toEqual(1);
          expect(typeof preview).toEqual('function');
          expect(typeof upload).toEqual('function');
          expect(typeof cancel).toEqual('function');
          expect(typeof stop).toEqual('function');
          expect(file.task.status).toEqual(status);
          if (file.task.status === 2) {
            expect(total).toEqual(FILE_SIZE);
            expect(complete).toEqual(readIndex * file.task.config.chunkSize);
            readIndex++;
          } else if (file.task.status === 3) {
            expect(total).toEqual(
              Math.ceil(FILE_SIZE / file.task.config.chunkSize),
            );
            expect(complete).toEqual(uploadIndex);
            uploadIndex++;
          }
          return (
            <div className={defineItemNodeClass}>
              <span onClick={preview} className="item-render-preview">
                预览
              </span>
              <span onClick={upload} className="item-render-upload">
                上传
              </span>
              <span onClick={cancel} className="item-render-cancel">
                取消
              </span>
              <span onClick={stop} className="item-render-stop">
                停止
              </span>
            </div>
          );
        },
      };

      const wrapper = mount(<Upload ref={ref} {...props} />);

      await act(async () => {
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });

        await sleep(1000);

        wrapper.update();

        expect(wrapper.exists(`.${defineItemNodeClass}`)).toBeTruthy();
      });

      await act(async () => {
        //上传
        wrapper.find('.item-render-upload').simulate('click');

        const [file] = ref.current.getFiles();
        expect(file.task.status > 0).toBeTruthy();

        //暂停
        wrapper.find('.item-render-stop').simulate('click');
        expect(file.task.status == -1).toBeTruthy();

        //取消
        wrapper.find('.item-render-cancel').simulate('click');
        expect(removeDone).toBeTruthy();

        //预览
        wrapper.find('.item-render-preview').simulate('click');
        expect(previewDone).toBeTruthy();
      });
    });

    it(`itemRender return originElement test`, () => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
        itemRender: (originNode) => {
          return originNode;
        },
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists(`.chunk-upload-list-item`)).toBeTruthy();
    });
  });

  describe('showUploadList test', () => {
    it(`showUploadList return false`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
        showUploadList: false,
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists(`.chunk-upload-list-item`)).toBeFalsy();

      done();
    });

    it(`showUploadList return true`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
        showUploadList: true,
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists(`.chunk-upload-list-item`)).toBeTruthy();
      const buttons = wrapper.find('.chunk-upload-list-item button');
      expect(buttons.length >= 3).toBeTruthy();

      //upload
      const upload = buttons.at(0).find('span');
      expect(upload.hasClass('anticon-upload')).toBeTruthy();

      //remove
      const remove = buttons.at(1).find('span');
      expect(remove.hasClass('anticon-delete')).toBeTruthy();

      //preview
      const preview = buttons.at(2).find('span');
      expect(preview.hasClass('anticon-eye')).toBeTruthy();

      done();
    });

    it(`showUploadList return set previewIcon show`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
        showUploadList: {
          showPreviewIcon: true,
        },
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists(`.chunk-upload-list-item`)).toBeTruthy();
      const buttons = wrapper.find('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //preview
      const preview = buttons.at(0).find('span');
      expect(preview.hasClass('anticon-eye')).toBeTruthy();

      done();
    });

    it(`showUploadList return set custom previewIcon show`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];
      const testPreviewIconClass = 'testPreviewIconClass';

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
        showUploadList: {
          previewIcon: <span className={testPreviewIconClass}></span>,
        },
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists(`.chunk-upload-list-item`)).toBeTruthy();
      const buttons = wrapper.find('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //preview
      const preview = buttons.at(0).find('span');
      expect(preview.hasClass(testPreviewIconClass)).toBeTruthy();

      done();
    });

    it(`showUploadList return set custom function previewIcon show`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];
      const testPreviewIconClass = 'testPreviewIconClass';

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
        showUploadList: {
          previewIcon: (file) => {
            expect(typeof file).toBeDefined();
            return <span className={testPreviewIconClass}></span>;
          },
        },
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists(`.chunk-upload-list-item`)).toBeTruthy();
      const buttons = wrapper.find('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //preview
      const preview = buttons.at(0).find('span');
      expect(preview.hasClass(testPreviewIconClass)).toBeTruthy();

      done();
    });

    it(`showUploadList return set uploadIcon show`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
        showUploadList: {
          showUploadIcon: true,
        },
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists(`.chunk-upload-list-item`)).toBeTruthy();
      const buttons = wrapper.find('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //upload
      const preview = buttons.at(0).find('span');
      expect(preview.hasClass('anticon-upload')).toBeTruthy();

      done();
    });

    it(`showUploadList return set custom uploadIcon show`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];
      const testPreviewIconClass = 'testPreviewIconClassUpload';

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
        showUploadList: {
          uploadIcon: <span className={testPreviewIconClass}></span>,
        },
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists(`.chunk-upload-list-item`)).toBeTruthy();
      const buttons = wrapper.find('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //upload
      const preview = buttons.at(0).find('span');
      expect(preview.hasClass(testPreviewIconClass)).toBeTruthy();

      done();
    });

    it(`showUploadList return set custom function uploadIcon show`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];
      const testPreviewIconClass = 'testPreviewIconClassUploadFunction';

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
        showUploadList: {
          uploadIcon: (file) => {
            expect(typeof file).toBeDefined();
            return <span className={testPreviewIconClass}></span>;
          },
        },
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists(`.chunk-upload-list-item`)).toBeTruthy();
      const buttons = wrapper.find('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //preview
      const preview = buttons.at(0).find('span');
      expect(preview.hasClass(testPreviewIconClass)).toBeTruthy();

      done();
    });

    it(`showUploadList return set removeIcon show`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
        showUploadList: {
          showRemoveIcon: true,
        },
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists(`.chunk-upload-list-item`)).toBeTruthy();
      const buttons = wrapper.find('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //upload
      const preview = buttons.at(0).find('span');
      expect(preview.hasClass('anticon-delete')).toBeTruthy();

      done();
    });

    it(`showUploadList return set custom removeIcon show`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];
      const testPreviewIconClass = 'testPreviewIconClassUploadRemove';

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
        showUploadList: {
          removeIcon: <span className={testPreviewIconClass}></span>,
        },
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists(`.chunk-upload-list-item`)).toBeTruthy();
      const buttons = wrapper.find('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //upload
      const preview = buttons.at(0).find('span');
      expect(preview.hasClass(testPreviewIconClass)).toBeTruthy();

      done();
    });

    it(`showUploadList return set custom function removeIcon show`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];
      const testPreviewIconClass = 'testPreviewIconClassRemoveFunction';

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
        showUploadList: {
          removeIcon: (file) => {
            expect(typeof file).toBeDefined();
            return <span className={testPreviewIconClass}></span>;
          },
        },
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists(`.chunk-upload-list-item`)).toBeTruthy();
      const buttons = wrapper.find('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //preview
      const preview = buttons.at(0).find('span');
      expect(preview.hasClass(testPreviewIconClass)).toBeTruthy();

      done();
    });

    it(`showUploadList return set custom stopIcon show`, async () => {
      await new Promise(async (resolve, reject) => {
        const ref = React.createRef();
        const testPreviewIconClass = 'testPreviewIconClassStop';

        const props = {
          viewType: 'list',
          request: {
            exitDataFn,
            uploadFn,
            completeFn,
          },
          showUploadList: {
            uploadIcon: <span className={testPreviewIconClass}></span>,
          },
          immediately: false,
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);
        });

        await act(async () => {
          wrapper.update();

          uploadTask(wrapper);

          const buttons = wrapper.find('.chunk-upload-list-item button');
          expect(buttons.length >= 1).toBeTruthy();

          //stop
          const stop = buttons.at(0).find('span');
          expect(stop.hasClass(testPreviewIconClass)).toBeTruthy();

          wrapper.unmount();
        });

        resolve();
      });
    });

    it(`showUploadList return set custom function stopIcon show`, async () => {
      await new Promise(async (resolve, reject) => {
        const ref = React.createRef();
        const testPreviewIconClass = 'testPreviewIconClassStop';

        const props = {
          viewType: 'list',
          request: {
            exitDataFn,
            uploadFn,
            completeFn,
          },
          showUploadList: {
            uploadIcon: (file) => {
              expect(file).toBeDefined();
              return <span className={testPreviewIconClass}></span>;
            },
          },
          immediately: false,
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);
        });

        await act(async () => {
          wrapper.update();

          uploadTask(wrapper);

          const buttons = wrapper.find('.chunk-upload-list-item button');
          expect(buttons.length >= 1).toBeTruthy();

          //stop
          const stop = buttons.at(0).find('span');
          expect(stop.hasClass(testPreviewIconClass)).toBeTruthy();

          wrapper.unmount();
        });

        resolve();
      });
    });
  });

  describe('previewFile test', () => {
    it(`previewFile return false that use the default preview`, async () => {
      const props = {
        viewType: 'list',
        immediately: false,
        onPreviewFile() {
          return true;
        },
        previewFile: async (file, viewType) => {
          await sleep(100);
          expect(file).toBeDefined();
          expect(viewType).toEqual('list');
          return false;
        },
      };

      const wrapper = mount(<Upload {...props} />);

      await act(async () => {
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });

        await sleep(1000);
      });

      await act(async () => {
        wrapper.update();

        //预览
        previewTask(wrapper);

        await sleep(1000);

        const modal = document.querySelector(`.ant-modal-wrap`);
        const style = modal.getAttribute('style');
        expect(!style || !style.includes('display')).toBeTruthy();
      });
    });

    it(`previewFile return ReactNode that use newElement`, async () => {
      const defineItemNodeClass = 'definePreviewFileClass';

      let previewDone = false;

      const props = {
        viewType: 'list',
        immediately: false,
        onPreviewFile() {
          previewDone = true;
          return true;
        },
        previewFile: async (file, viewType) => {
          await sleep(100);
          expect(file).toBeDefined();
          expect(viewType).toEqual('list');
          return <span className={defineItemNodeClass}></span>;
        },
      };

      const wrapper = mount(<Upload {...props} />);

      await act(async () => {
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });

        await sleep(1000);
      });

      await act(async () => {
        wrapper.update();

        //预览
        previewTask(wrapper);
        await sleep(1000);
        wrapper.update();
        expect(wrapper.exists(`.${defineItemNodeClass}`)).toBeTruthy();
        expect(previewDone).toBeTruthy();
      });
    });
  });

  describe('onPreviewFile test', () => {
    it(`onPreviewFile return false and that not show the preview`, async () => {
      let previewDone = false;
      let previewFileDone = false;

      const props = {
        viewType: 'list',
        immediately: false,
        onPreviewFile() {
          previewDone = true;
          return false;
        },
        previewFile: () => {
          previewFileDone = true;
        },
      };

      const wrapper = mount(<Upload {...props} />);

      await act(async () => {
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });

        await sleep(1000);
      });

      await act(async () => {
        wrapper.update();

        //预览
        previewTask(wrapper);
        await sleep(1000);
        wrapper.update();
        expect(previewFileDone).toBeFalsy();
        expect(previewDone).toBeTruthy();
      });
    });

    it(`onPreviewFile return false and that not show the custom preview`, async () => {
      const defineItemNodeClass = 'definePreviewFileClass';

      let previewDone = false;

      const props = {
        viewType: 'list',
        immediately: false,
        onPreviewFile() {
          previewDone = true;
          return false;
        },
        previewFile: async (file, viewType) => {
          await sleep(100);
          expect(file).toBeDefined();
          expect(viewType).toEqual('list');
          return <span className={defineItemNodeClass}></span>;
        },
      };

      const wrapper = mount(<Upload {...props} />);

      await act(async () => {
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });

        await sleep(1000);
      });

      await act(async () => {
        wrapper.update();

        //预览
        previewTask(wrapper);
        await sleep(1000);
        wrapper.update();
        expect(wrapper.exists(`.${defineItemNodeClass}`)).toBeFalsy();
        expect(previewDone).toBeTruthy();
      });
    });
  });

  describe('containerRender test', () => {
    it(`containerRender return list viewType container`, async () => {
      const testClassName = 'testClassName-container';

      const props = {
        viewType: 'list',
        request: DEFAULT_REQUEST,
        immediately: false,
        locale: {
          container: '你好',
        },
        containerRender: ({
          isDragAccept,
          isDragActive,
          isDragReject,
          isFocused,
          isFileDialogActive,
          isLimit,
          locale,
        }) => {
          expect(typeof isDragAccept).toEqual('boolean');
          expect(typeof isDragActive).toEqual('boolean');
          expect(typeof isDragReject).toEqual('boolean');
          expect(typeof isFocused).toEqual('boolean');
          expect(typeof isFileDialogActive).toEqual('boolean');
          expect(typeof isLimit).toEqual('boolean');
          expect(typeof locale).toEqual('object');
          expect(locale.container).toEqual('你好');
          return <span className={testClassName}>hello</span>;
        },
      };

      const ref = React.createRef();

      const wrapper = mount(<Upload ref={ref} {...props} />);

      await act(async () => {
        await sleep(100);
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });

        await sleep(1000);
      });

      const files = ref.current.getFiles(true);
      expect(files.length).toEqual(1);

      expect(wrapper.exists(`.${testClassName}`)).toBeTruthy();
    });
  });

  describe('immediately test', () => {
    it(`immediately set true will upload immediately`, async () => {
      const ref = React.createRef();

      const props = {
        viewType: 'list',
        immediately: true,
        request: DEFAULT_REQUEST,
      };

      const wrapper = mount(<Upload ref={ref} {...props} />);

      await act(async () => {
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });

        await sleep(1000);

        wrapper.update();

        const files = ref.current.getFiles();
        expect(files.length).toEqual(1);
        expect(files[0].getStatus() != 0).toBeTruthy();

        wrapper.unmount();
      });
    });

    it(`immediately set false need click button to upload`, async () => {
      const ref = React.createRef();

      const props = {
        viewType: 'list',
        immediately: false,
        request: DEFAULT_REQUEST,
      };

      const wrapper = mount(<Upload ref={ref} {...props} />);

      await act(async () => {
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });

        await sleep(1000);

        wrapper.update();

        const files = ref.current.getFiles();
        expect(files.length).toEqual(1);
        expect(files[0].getStatus() == 0).toBeTruthy();

        wrapper.unmount();
      });
    });
  });

  describe('lifecycle test', () => {
    it(`normal lifecycle test`, async () => {
      await new Promise(async (resolve, reject) => {
        const ref = React.createRef();

        const lifecycle = {
          beforeRead: 0,
          reading: 0,
          beforeCheck: 0,
          afterCheck: 0,
          uploading: 0,
          beforeComplete: 0,
          afterComplete: 0,
        };

        const props = {
          viewType: 'list',
          immediately: true,
          request: {
            ...DEFAULT_REQUEST,
            callback: (error, value) => {
              let realError = error;
              try {
                expect(
                  Object.values(lifecycle).every((item) => !!item),
                ).toBeTruthy();
              } catch (err) {
                realError = err;
              }
              if (realError) {
                reject(error);
              } else {
                resolve();
              }
            },
          },
          lifecycle: {
            beforeRead() {
              lifecycle.beforeRead++;
            },
            reading() {
              lifecycle.reading++;
            },
            beforeCheck() {
              lifecycle.beforeCheck++;
            },
            afterCheck() {
              lifecycle.afterCheck++;
            },
            uploading() {
              lifecycle.uploading++;
            },
            beforeComplete() {
              lifecycle.beforeComplete++;
            },
            afterComplete() {
              lifecycle.afterComplete++;
            },
          },
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);

          wrapper.update();

          const files = ref.current.getFiles();
          expect(files.length).toEqual(1);
        });
      });
    });

    it(`rejected lifecycle test`, async () => {
      await new Promise(async (resolve, reject) => {
        const ref = React.createRef();

        const lifecycle = {
          beforeRead: 0,
          reading: 0,
          beforeCheck: 0,
          afterCheck: 0,
          uploading: 0,
          beforeComplete: 0,
          afterComplete: 0,
        };

        const props = {
          viewType: 'list',
          immediately: true,
          request: {
            ...DEFAULT_REQUEST,
            completeFn: () => {
              throw new Error();
            },
            callback: (error) => {
              try {
                const { afterComplete, ...nextLifecycle } = lifecycle;
                expect(!!error).toBeTruthy();
                expect(
                  Object.values(nextLifecycle).every((item) => !!item),
                ).toBeTruthy();
                expect(afterComplete).toEqual(0);
              } catch (err) {
                reject(err);
              }
              resolve();
            },
          },
          lifecycle: {
            beforeRead() {
              lifecycle.beforeRead++;
            },
            reading() {
              lifecycle.reading++;
            },
            beforeCheck() {
              lifecycle.beforeCheck++;
            },
            afterCheck() {
              lifecycle.afterCheck++;
            },
            uploading() {
              lifecycle.uploading++;
            },
            beforeComplete() {
              lifecycle.beforeComplete++;
            },
            afterComplete() {
              lifecycle.afterComplete++;
            },
          },
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);

          wrapper.update();

          const files = ref.current.getFiles();
          expect(files.length).toEqual(1);
        });
      });
    });

    it(`stop lifecycle test`, async () => {
      await new Promise(async (resolve, reject) => {
        const ref = React.createRef();
        let changed = false;

        const lifecycle = {
          beforeRead: 0,
          reading: 0,
          beforeCheck: 0,
          afterCheck: 0,
          uploading: 0,
          beforeComplete: 0,
          afterComplete: 0,
          afterStop: 0,
        };

        const props = {
          viewType: 'list',
          immediately: true,
          onChange(value) {
            if (value.length == 1) {
              changed = true;
            }
          },
          request: {
            ...DEFAULT_REQUEST,
            callback: (error) => {
              try {
                const { afterComplete, ...nextLifecycle } = lifecycle;
                expect(!!error).toBeTruthy();
                expect(
                  Object.values(nextLifecycle).every((item) => !!item),
                ).toBeTruthy();
                expect(afterComplete).toEqual(0);
                expect(changed).toBeTruthy;
                const files = ref.current.getFiles();
                expect(files[0].getStatus()).toEqual(-1);
              } catch (err) {
                reject(err);
              }
              resolve();
            },
          },
          lifecycle: {
            afterStop() {
              lifecycle.afterStop++;
            },
            beforeRead() {
              lifecycle.beforeRead++;
            },
            reading() {
              lifecycle.reading++;
            },
            beforeCheck() {
              lifecycle.beforeCheck++;
            },
            afterCheck() {
              lifecycle.afterCheck++;
            },
            uploading() {
              lifecycle.uploading++;
            },
            beforeComplete() {
              lifecycle.beforeComplete++;
              wrapper.update();
              stopTask(wrapper);
            },
            afterComplete() {
              lifecycle.afterComplete++;
            },
          },
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);

          wrapper.update();
        });
      });
    });

    it(`cancel lifecycle test`, async () => {
      await new Promise(async (resolve, reject) => {
        const ref = React.createRef();
        let changed = false;

        const lifecycle = {
          beforeRead: 0,
          reading: 0,
          beforeCheck: 0,
          afterCheck: 0,
          uploading: 0,
          beforeComplete: 0,
          afterComplete: 0,
          afterCancel: 0,
        };

        const props = {
          viewType: 'list',
          immediately: true,
          onChange(value) {
            if (value.length == 1) {
              changed = true;
            }
          },
          request: {
            ...DEFAULT_REQUEST,
            callback: (error) => {
              try {
                const { afterComplete, ...nextLifecycle } = lifecycle;
                expect(!!error).toBeTruthy();
                expect(
                  Object.values(nextLifecycle).every((item) => !!item),
                ).toBeTruthy();
                expect(afterComplete).toEqual(0);
                expect(changed).toBeTruthy;
                const files = ref.current.getFiles();
                expect(files[0].getStatus()).toEqual(-2);
              } catch (err) {
                reject(err);
              }
              resolve();
            },
          },
          lifecycle: {
            afterCancel() {
              lifecycle.afterCancel++;
            },
            beforeRead() {
              lifecycle.beforeRead++;
            },
            reading() {
              lifecycle.reading++;
            },
            beforeCheck() {
              lifecycle.beforeCheck++;
            },
            afterCheck() {
              lifecycle.afterCheck++;
            },
            uploading() {
              lifecycle.uploading++;
            },
            beforeComplete() {
              lifecycle.beforeComplete++;
              wrapper.update();
              deleteTask(wrapper);
            },
            afterComplete() {
              lifecycle.afterComplete++;
            },
          },
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);

          wrapper.update();
        });
      });
    });
  });

  describe('accept test', () => {
    it(`accept video set test`, (done) => {
      const props = {
        viewType: 'list',
        immediately: false,
        onChange(value) {
          expect(value.length).toEqual(0);
          done();
        },
        onValidator(error) {
          expect(error.length).toEqual(1);
        },
        accept: 'video/*',
      };

      const wrapper = mount(<Upload {...props} />);

      act(() => {
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });
      });
    });
  });

  describe('minSize test', () => {
    it(`set minSize limit the fileSize`, (done) => {
      const props = {
        viewType: 'list',
        immediately: false,
        onChange(value) {
          expect(value.length).toEqual(0);
          done();
        },
        onValidator(error) {
          expect(error.length).toEqual(1);
        },
        minSize: FILE_SIZE + 100,
      };

      const wrapper = mount(<Upload {...props} />);

      act(() => {
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });
      });
    });
  });

  describe('maxSize test', () => {
    it(`set maxSize limit the fileSize`, (done) => {
      const props = {
        viewType: 'list',
        immediately: false,
        onChange(value) {
          expect(value.length).toEqual(0);
          done();
        },
        onValidator(error) {
          expect(error.length).toEqual(1);
        },
        maxSize: FILE_SIZE - 100,
      };

      const wrapper = mount(<Upload {...props} />);

      act(() => {
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });
      });
    });
  });

  describe('maxFiles test', () => {
    it(`set maxFiles limit the file length`, (done) => {
      const props = {
        viewType: 'list',
        immediately: false,
        onChange(value) {
          expect(value.length).toEqual(0);
          done();
        },
        onValidator(error) {
          expect(error.length).toEqual(2);
        },
        maxFiles: 1,
        multiple: true,
      };

      const wrapper = mount(<Upload {...props} />);

      act(() => {
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });
      });
    });

    it(`set maxFiles for 0 to not limit the file length`, (done) => {
      const props = {
        viewType: 'list',
        immediately: false,
        onChange(value) {
          expect(value.length).toEqual(2);
          done();
        },
        onValidator(error) {
          expect(error.length).toEqual(0);
        },
        maxFiles: 0,
        multiple: true,
      };

      const wrapper = mount(<Upload {...props} />);

      act(() => {
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });
      });
    });

    it(`not set maxFiles to not limit the file length`, (done) => {
      const props = {
        viewType: 'list',
        immediately: false,
        onChange(value) {
          expect(value.length).toEqual(2);
          done();
        },
        onValidator(error) {
          expect(error.length).toEqual(0);
        },
        multiple: true,
      };

      const wrapper = mount(<Upload {...props} />);

      act(() => {
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });
      });
    });
  });

  describe('limit test', () => {
    it(`set limit the file length`, () => {
      const props = {
        viewType: 'list',
        immediately: false,
        limit: 1,
        value: [MOCK_COMPLETE_STRING_FILE],
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists('.chunk-upload-dropzone-list')).toBeFalsy();
    });

    it(`set limit the file length and the custom container params isLimit is true`, () => {
      const props = {
        viewType: 'list',
        immediately: false,
        limit: 1,
        value: [MOCK_COMPLETE_STRING_FILE],
        containerRender: ({ isLimit }) => {
          expect(isLimit).toBeTruthy();
          return <span></span>;
        },
      };

      mount(<Upload {...props} />);
    });

    it(`not set limit the file length`, () => {
      const props = {
        viewType: 'list',
        immediately: false,
        value: [MOCK_COMPLETE_STRING_FILE],
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists('.chunk-upload-dropzone-list')).toBeTruthy();
    });

    it(`set limit value for -1`, () => {
      const props = {
        viewType: 'list',
        immediately: false,
        value: [MOCK_COMPLETE_STRING_FILE],
        limit: -1,
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists('.chunk-upload-dropzone-list')).toBeTruthy();
    });
  });

  describe('disabled test', () => {
    it(`set disabled to disable click upload`, async () => {
      const props = {
        viewType: 'list',
        immediately: false,
        disabled: true,
      };

      const ref = React.createRef();

      const wrapper = mount(<Upload ref={ref} {...props} />);

      await act(async () => {
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });

        await sleep(100);

        expect(ref.current.getFiles().length).toEqual(0);
      });
    });

    it(`set disabled to disable drop upload`, async () => {
      const props = {
        viewType: 'list',
        immediately: false,
        disabled: true,
      };

      const ref = React.createRef();

      const wrapper = mount(<Upload ref={ref} {...props} />);

      await act(async () => {
        wrapper.find('input').simulate('drop', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });

        await sleep(100);

        expect(ref.current.getFiles().length).toEqual(0);
      });
    });
  });

  describe('multiple test', () => {
    it(`can select multiple file`, (done) => {
      const props = {
        viewType: 'list',
        immediately: false,
        onChange(value) {
          expect(value.length).toEqual(2);
          done();
        },
        multiple: true,
      };

      const wrapper = mount(<Upload {...props} />);

      act(() => {
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });
      });
    });
  });

  describe('locale test', () => {
    const valid = (value, wrapper, find) => {
      const wrapperProgress = wrapper.find(find);
      wrapperProgress.update();
      expect(wrapperProgress.text()).toEqual(value);
    };

    it(`set locale list`, async () => {
      await new Promise(async (resolve, reject) => {
        const ref = React.createRef();

        const locale = {
          container: 'testLocaleListContainer',
          containerIcon: 'testLocaleListContainerIcon',
          progress: {
            pending: 'testLocaleListPending',
            waiting: 'testLocaleListWaiting',
            reading: 'testLocaleListReading',
            uploading: 'testLocaleListUploading',
            fulfilled: 'testLocaleListFulfilled',
          },
        };

        const props = {
          viewType: 'list',
          immediately: false,
          request: {
            ...DEFAULT_REQUEST,
            callback: (error, value) => {
              valid(
                locale.progress.fulfilled,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            },
          },
          locale: locale,
          lifecycle: {
            beforeRead() {
              valid(
                locale.progress.reading,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
            },
            reading() {
              valid(
                locale.progress.reading,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
            },
            beforeCheck() {
              valid(
                locale.progress.uploading,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
            },
            afterCheck() {
              valid(
                locale.progress.uploading,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
            },
            uploading() {
              valid(
                locale.progress.uploading,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
            },
            beforeComplete() {
              valid(
                locale.progress.uploading,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
            },
            afterComplete() {
              valid(
                locale.progress.fulfilled,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
            },
          },
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);
        const wrapperIcon = wrapper.find('.chunk-upload-container-icon');
        expect(wrapperIcon.text().includes(locale.containerIcon)).toBeTruthy();
        const wrapperContainer = wrapper.find('.chunk-upload-dropzone-list');
        expect(wrapperContainer.text().includes(locale.container)).toBeTruthy();

        await act(async () => {
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);

          wrapper.update();

          const files = ref.current.getFiles();
          expect(files.length).toEqual(1);
          expect(files[0].getStatus() == 0).toBeTruthy();

          uploadTask(wrapper);

          await sleep(1000);
        });
      });
    });

    it(`set locale card`, async () => {
      await new Promise(async (resolve, reject) => {
        const ref = React.createRef();

        const locale = {
          container: 'testLocaleCardContainer',
          containerIcon: 'testLocaleCardContainerIcon',
          progress: {
            pending: 'testLocaleCardPending',
            waiting: 'testLocaleCardWaiting',
            reading: 'testLocaleCardReading',
            uploading: 'testLocaleCardUploading',
            fulfilled: 'testLocaleCardFulfilled',
          },
        };

        const props = {
          viewType: 'card',
          immediately: false,
          request: {
            ...DEFAULT_REQUEST,
            callback: (error, value) => {
              valid(
                locale.progress.fulfilled,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            },
          },
          locale: locale,
          lifecycle: {
            beforeRead() {
              valid(
                locale.progress.reading,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
            },
            reading() {
              valid(
                locale.progress.reading,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
            },
            beforeCheck() {
              valid(
                locale.progress.uploading,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
            },
            afterCheck() {
              valid(
                locale.progress.uploading,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
            },
            uploading() {
              valid(
                locale.progress.uploading,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
            },
            beforeComplete() {
              valid(
                locale.progress.uploading,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
            },
            afterComplete() {
              valid(
                locale.progress.fulfilled,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
            },
          },
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);
        const wrapperIcon = wrapper.find(
          '.chunk-upload-dropzone-card-content-icon-content',
        );
        expect(wrapperIcon.text().includes(locale.containerIcon)).toBeTruthy();
        const wrapperContainer = wrapper.find(
          '.chunk-upload-dropzone-card-content',
        );
        expect(wrapperContainer.text().includes(locale.container)).toBeTruthy();

        await act(async () => {
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);

          wrapper.update();

          const files = ref.current.getFiles();
          expect(files.length).toEqual(1);
          expect(files[0].getStatus() == 0).toBeTruthy();

          uploadTask(wrapper, 0, false);

          await sleep(1000);
        });
      });
    });

    it(`set locale on stop locale`, async () => {
      await new Promise(async (resolve, reject) => {
        let stopDone = false;

        const ref = React.createRef();

        const locale = {
          progress: {
            stopping: 'testLocaleListStopStopping',
          },
        };

        const props = {
          viewType: 'list',
          immediately: false,
          request: {
            ...DEFAULT_REQUEST,
            uploadFn: () => {
              wrapper.update();
              stopTask(wrapper);
            },
            callback: (error, value) => {
              expect(stopDone).toBeTruthy();
              if (error) {
                resolve();
              } else {
                reject();
              }
            },
          },
          locale: locale,
          lifecycle: {
            afterStop: () => {
              stopDone = true;
              valid(
                locale.progress.stopping,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
            },
          },
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);

          wrapper.update();

          const files = ref.current.getFiles();
          expect(files.length).toEqual(1);
          expect(files[0].getStatus() == 0).toBeTruthy();

          uploadTask(wrapper);

          await sleep(1000);
        });
      });
    });

    it(`set locale on reject locale`, async () => {
      await new Promise(async (resolve, reject) => {
        const ref = React.createRef();

        const locale = {
          progress: {
            rejected: 'testLocaleListRejectRejected',
          },
        };

        const props = {
          viewType: 'list',
          immediately: false,
          request: {
            ...DEFAULT_REQUEST,
            uploadFn: () => {
              throw new Error();
            },
            callback: (error, value) => {
              valid(
                locale.progress.rejected,
                wrapper,
                '.chunk-upload-list-progress-status',
              );
              if (error) {
                resolve();
              } else {
                reject();
              }
            },
          },
          locale: locale,
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);

          wrapper.update();

          const files = ref.current.getFiles();
          expect(files.length).toEqual(1);
          expect(files[0].getStatus() == 0).toBeTruthy();

          uploadTask(wrapper);

          await sleep(1000);
        });
      });
    });
  });

  describe('onError test', () => {
    it('upload error deal the onError', async () => {
      await new Promise(async (resolve, reject) => {
        const ref = React.createRef();
        let errorDone = false;

        const props = {
          viewType: 'list',
          immediately: true,
          onError: (error, files) => {
            errorDone = true;
            expect(!!error).toBeTruthy();
            expect(files.error === error).toBeTruthy();
          },
          request: {
            ...DEFAULT_REQUEST,
            completeFn: () => {
              throw new Error();
            },
            callback: (error) => {
              try {
                expect(!!error).toBeTruthy();
                expect(errorDone).toBeTruthy();
              } catch (err) {
                reject(err);
              }
              resolve();
            },
          },
        };

        const wrapper = mount(<Upload ref={ref} {...props} />);

        await act(async () => {
          wrapper.find('input').simulate('change', {
            target: {
              files: [
                ChunkUpload.arraybuffer2file(
                  new ArrayBuffer(FILE_SIZE),
                  FILE_NAME,
                  {
                    type: FILE_TYPE,
                  },
                ),
              ],
            },
          });

          await sleep(1000);

          wrapper.update();

          const files = ref.current.getFiles();
          expect(files.length).toEqual(1);
        });
      });
    });
  });

  describe('viewStyle test', () => {
    it(`viewStyle test`, (done) => {
      let changeValue = [MOCK_COMPLETE_STRING_FILE];
      const testStyle = {
        color: 'red',
      };

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
        viewStyle: testStyle,
      };

      const wrapper = mount(<Upload {...props} />);

      const aside = wrapper.find('aside');

      const asideProps = aside.props();

      expect(asideProps.style).toBeDefined();
      const isEqual = Object.entries(testStyle).every((item) => {
        const [key, value] = item;
        return asideProps.style[key] === value;
      });

      expect(isEqual).toBeTruthy();

      done();
    });
  });

  describe('viewClassName test', () => {
    it(`viewClassName test`, (done) => {
      let changeValue = [MOCK_COMPLETE_STRING_FILE];
      const testClassName = 'testClassName';

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
        viewClassName: testClassName,
      };

      const wrapper = mount(<Upload {...props} />);

      const aside = wrapper.find('aside');

      expect(aside.hasClass(testClassName)).toBeTruthy();

      done();
    });
  });

  describe('viewType test', () => {
    it(`set list viewType test`, (done) => {
      let changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists('.chunk-upload-list-item')).toBeTruthy();

      done();
    });

    it(`set card viewType test`, (done) => {
      let changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        viewType: 'card',
        value: changeValue,
        immediately: false,
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists('.chunk-upload-card-item')).toBeTruthy();

      done();
    });

    it(`not set viewType test`, (done) => {
      let changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        value: changeValue,
        immediately: false,
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists('.chunk-upload-list-item')).toBeTruthy();

      done();
    });
  });

  describe('iconRender test', () => {
    it(`iconRender return newElement test`, (done) => {
      let changeValue = [MOCK_COMPLETE_STRING_FILE];
      const defineIconNodeClass = 'defineIconNodeClass';

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
        iconRender: (file, viewType, originNode) => {
          expect(file).toBeDefined();
          expect(viewType).toEqual('list');
          expect(originNode).toBeDefined();
          return <span className={defineIconNodeClass}></span>;
        },
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists(`.${defineIconNodeClass}`)).toBeTruthy();

      done();
    });

    it(`iconRender return originElement test`, (done) => {
      let changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        viewType: 'list',
        value: changeValue,
        immediately: false,
        iconRender: (file, viewType, originNode) => {
          expect(file).toBeDefined();
          expect(viewType).toEqual('list');
          expect(originNode).toBeDefined();
          return originNode;
        },
      };

      const wrapper = mount(<Upload {...props} />);

      expect(wrapper.exists(`.chunk-upload-view-list-icon`)).toBeTruthy();

      done();
    });
  });
});
