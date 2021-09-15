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

  it.skip(`remove many file in little times and file is uploading`, async () => {
    await new Promise(async (resolve, reject) => {
      const ref = React.createRef();

      let index = true;

      const props = {
        viewType: 'list',
        onChange: (value) => {
          if (first) {
            expect(value.length).toEqual(1);
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

        uploadTask(wrapper);

        await sleep(100);

        deleteTask(wrapper);

        wrapper.update();

        const files = ref.current.getFiles();
        expect(files.length).toEqual(0);
      });
    });
  });

  it.skip(`use the callback style setState on onChange`, () => {});
});
