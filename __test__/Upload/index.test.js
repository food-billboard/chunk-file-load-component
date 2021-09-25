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
} from './utils';

describe(`error test`, () => {
  it(`remove file when the file is uploading`, async () => {
    await new Promise(async (resolve, reject) => {
      const ref = React.createRef();

      let first = true;

      const props = {
        viewType: 'list',
        onChange: (value) => {
          if (first) {
            expect(value.length).toEqual(1);
            first = false;
          } else {
            expect(value.length).toEqual(0);
            resolve();
          }
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

        await sleep(100);

        deleteTask(wrapper);

        wrapper.update();
      });
    });
  });

  it(`remove many file in little times and file is uploading`, async () => {
    await new Promise(async (resolve, reject) => {
      const ref = React.createRef();

      let index = 0;

      const props = {
        viewType: 'list',
        onRemove: async () => {
          await sleep(300);
          index++
          if (index == 3) {
            sleep(1000)
            .then((_) => {
              const value = ref.current.getFiles();
              expect(value.length).toEqual(0);
              resolve();
            })
            .catch(err => {
              reject(err)
            })
          }
          return true;
        },
        request: {
          exitDataFn: async (...args) => {
            await sleep(300);
            return exitDataFn(...args);
          },
          uploadFn,
          completeFn,
        },
        immediately: false,
        multiple: true,
      };

      let wrapper = mount(<Upload ref={ref} {...props} />);

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

        await sleep(1000);

        wrapper = wrapper.update();

        for (let i = 0; i < 3; i++) {
          uploadTask(wrapper, i);
          await sleep(60);
        }

        for (let i = 0; i < 3; i++) {
          deleteTask(wrapper, i);
          await sleep(60);
        }

        wrapper.update();
      });
    });
  });

  it(`use the callback style setState on onChange`, async () => {
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
        onChange: (value) => {
          expect(value).toBeInstanceOf(Array);
        },
        request: {
          exitDataFn,
          uploadFn,
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
