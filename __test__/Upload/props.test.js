import React from 'react';
import { mount, shallow, render } from 'enzyme';
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
} from './utils';
import {
  MOCK_COMPLETE_STRING_FILE,
  MOCK_COMPLETE_OBJECT_FILE,
} from './constants';

global.URL.createObjectURL = jest.fn(() => 'faker createObjectURL');

jest.mock('nanoid', () => {
  return {
    nanoid: () => Math.random().toString(),
  };
});

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
  describe.skip('defaultValue test', () => {
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
      const testName = MOCK_COMPLETE_OBJECT_FILE.filename;

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

  describe.skip('value test', () => {
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

  describe.skip('onChange test', () => {
    it(`onChange set`, async () => {
      await new Promise(async (resolve, reject) => {
        const ref = React.createRef();

        const props = {
          viewType: 'list',
          onChange: (value) => {
            expect(value).toBeInstanceOf(Array);
            expect(value.length).toEqual(1);
            isUploadValidFile(value);
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

  describe.skip('onValidator test', () => {
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

  describe.skip('onRemove test', () => {
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

        // await act(async () => {

        //   wrapper = wrapper.update()

        //   uploadTask(wrapper)

        //   await sleep(100)

        //   deleteTask(wrapper)

        //   wrapper.update()

        //   await sleep(100)

        //   const files = ref.current.getFiles()
        //   expect(files.length).toEqual(0)

        //   await sleep(1500);

        //   resolve()

        // })
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

        // await act(async () => {
        //   console.log(111111111)

        //   wrapper = wrapper.update()

        //   uploadTask(wrapper)

        //   deleteTask(wrapper)

        //   wrapper.update()

        //   await sleep(100);

        //   expect(ref.current.getFiles().length).toEqual(1)

        //   await sleep(1500);

        //   expect(ref.current.getFiles().length).toEqual(0)

        //   await sleep(100);

        //   resolve()

        // })
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

        // await act(async () => {

        //   console.log(2222222222222)

        //   wrapper = wrapper.update()

        //   uploadTask(wrapper)

        //   deleteTask(wrapper)

        //   wrapper.update()

        //   await sleep(100)

        //   expect(ref.current.getFiles().length).toEqual(1)

        //   await sleep(1500)

        //   expect(ref.current.getFiles().length).toEqual(0)

        //   await sleep(100);

        //   resolve()

        // })
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

        // await act(async () => {

        //   console.log(3333333333)

        //   wrapper = wrapper.update()

        //   uploadTask(wrapper)

        //   deleteTask(wrapper)

        //   wrapper.update()

        //   await sleep(100)

        //   expect(ref.current.getFiles().length).toEqual(1)

        //   await sleep(1500)

        //   expect(ref.current.getFiles().length).toEqual(1)

        //   await sleep(100);

        //   resolve()

        // })
      });
    });
  });

  describe.skip('viewStyle test', () => {
    it(`viewStyle test`, async () => {
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
  });

  describe.skip('viewClassName test', () => {
    it(`viewClassName test`, () => {});
  });

  describe.skip('viewType test', () => {
    it(`set list viewType test`, () => {});

    it(`set card viewType test`, () => {});

    it(`not set viewType test`, () => {});
  });

  describe.skip('iconRender test', () => {
    it(`iconRender return newElement test`, () => {});

    it(`iconRender return originElement test`, () => {});
  });

  describe.skip('itemRender test', () => {
    it(`itemRender return newElement test`, () => {});

    it(`itemRender return originElement test`, () => {});
  });

  describe.skip('showUploadList test', () => {
    it(`showUploadList return false`, () => {});

    it(`showUploadList return true`, () => {});

    it(`showUploadList return set previewIcon show`, () => {});

    it(`showUploadList return set custom previewIcon show`, () => {});

    it(`showUploadList return set custom function previewIcon show`, () => {});

    it(`showUploadList return set uploadIcon show`, () => {});

    it(`showUploadList return set custom uploadIcon show`, () => {});

    it(`showUploadList return set custom function uploadIcon show`, () => {});

    it(`showUploadList return set removeIcon show`, () => {});

    it(`showUploadList return set custom removeIcon show`, () => {});

    it(`showUploadList return set custom function removeIcon show`, () => {});

    it(`showUploadList return set custom stopIcon show`, () => {});

    it(`showUploadList return set custom function stopIcon show`, () => {});
  });

  describe.skip('previewFile test', () => {
    it(`previewFile return false that use the default preview`, () => {});

    it(`previewFile return ReactNode that use newElement`, () => {});
  });

  describe.skip('onPreviewFile test', () => {
    it(`onPreviewFile return false and that not show the preview`, () => {});

    it(`onPreviewFile return false and that not show the custom preview`, () => {});
  });

  describe.skip('containerRender test', () => {
    it(`containerRender return list viewType container`, () => {});
  });

  describe.skip('immediately test', () => {
    it(`immediately set true will upload immediately`, () => {});

    it(`immediately set false need click button to upload`, () => {});
  });

  describe.skip('actionUrl test', () => {});

  describe.skip('method test', () => {});

  describe.skip('headers test', () => {});

  describe.skip('withCredentials test', () => {});

  describe.skip('request test', () => {});

  describe.skip('lifecycle test', () => {
    it(`normal lifecycle test`, () => {});

    it(`rejected lifecycle test`, () => {});

    it(`stop lifecycle test`, () => {});

    it(`cancel lifecycle test`, () => {});
  });

  describe.skip('accept test', () => {
    it(`accept image set test`, () => {});
  });

  describe.skip('minSize test', () => {
    it(`set minSize limit the fileSize`, () => {});
  });

  describe.skip('maxSize test', () => {
    it(`set maxSize limit the fileSize`, () => {});
  });

  describe.skip('maxFiles test', () => {
    it(`set maxFiles limit the file length`, () => {});
  });

  describe.skip('disabled test', () => {
    it(`set disabled to disable click upload`, () => {});

    it(`set disabled to disable drop upload`, () => {});
  });

  describe.skip('validator test', () => {
    it(`set custom validator rule`, () => {});
  });

  describe.skip('multiple test', () => {
    it(`can select multiple file`, () => {});
  });

  describe.skip('locale test', () => {
    it(`set locale`, () => {});
  });
});
