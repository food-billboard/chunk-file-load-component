import React, { Component } from 'react';
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
  DEFAULT_REQUEST
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

  it(`change the viewType when uploading`, async () => {

    await new Promise(async (resolve, reject) => {

      const ref = React.createRef();

      const props = {
        immediately: false,
        request: {
          uploadFn: (...args) => {
            return uploadFn(...args);
          },
          exitDataFn: (...args) => {
            return exitDataFn(...args);
          },
          callback: (error, value) => {
            if(error) {
              reject(error)
            }else {
              resolve()
            }
          },
        }
      }

      class CustomUpload extends Component {

        state = {
          viewType: "list"
        }

        ref = React.createRef()

        changeType = () => {
          const { viewType } = this.state 
          this.setState({
            viewType: viewType === "list" ? "card" : "list"
          })
        }

        render() {

          const { viewType } = this.state 

          return (
            <Upload viewType={viewType} ref={this.ref} {...this.props} />
          )

        }

      }

      const wrapper = mount(<CustomUpload ref={ref} {...props} />);

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

        uploadTask(wrapper);

        const prevFiles = ref.current.ref.current.getFiles();
        expect(prevFiles.length).toEqual(1);

        const [ prevFile ] = prevFiles
        const prevStatus = prevFile.getStatus() 
        const { current: prevCurrent } = prevFile.getProgress()

        ref.current.changeType()

        await sleep(10)

        const files = ref.current.ref.current.getFiles();
        expect(files.length).toEqual(1);

        const [ file ] = files
        const status = file.getStatus() 
        const { current } = file.getProgress()

        expect(status >= prevStatus).toBeTruthy()
        expect(current >= prevCurrent).toBeTruthy()

      });
    });

  })

  it(`change the viewType when uploaded`, async () => {

    await new Promise(async (resolve, reject) => {

      const ref = React.createRef();

      const props = {
        immediately: false,
        request: {
          uploadFn: (...args) => {
            return uploadFn(...args);
          },
          exitDataFn: (...args) => {
            return exitDataFn(...args);
          },
          callback: async (error, value) => {
            const prevFiles = ref.current.ref.current.getFiles();
            expect(prevFiles.length).toEqual(1);
    
            const [ prevFile ] = prevFiles
            const prevStatus = prevFile.getStatus() 
            const { current: prevCurrent } = prevFile.getProgress()
    
            ref.current.changeType()

            await sleep(10)
    
            const files = ref.current.ref.current.getFiles();
            expect(files.length).toEqual(1);
    
            const [ file ] = files
            const status = file.getStatus() 
            const { current } = file.getProgress()
    
            expect(status == prevStatus).toBeTruthy()
            expect(current == prevCurrent).toBeTruthy()
            if(error) {
              reject(error)
            }else {
              resolve()
            }
          },
        }
      }

      class CustomUpload extends Component {

        state = {
          viewType: "list"
        }

        ref = React.createRef()

        changeType = () => {
          const { viewType } = this.state 
          this.setState({
            viewType: viewType === "list" ? "card" : "list"
          })
        }

        render() {

          const { viewType } = this.state 

          return (
            <Upload viewType={viewType} ref={this.ref} {...this.props} />
          )

        }

      }

      const wrapper = mount(<CustomUpload ref={ref} {...props} />);

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

        uploadTask(wrapper);

        const prevFiles = ref.current.ref.current.getFiles();
        expect(prevFiles.length).toEqual(1);

      });
    });

  })

  it(`continue the task when the task stop before`, async () => {

    await new Promise(async (resolve, reject) => {
      let stopDone = false;

      const ref = React.createRef();

      const props = {
        viewType: 'list',
        immediately: false,
        request: {
          ...DEFAULT_REQUEST,
          exitDataFn,
          uploadFn,
          callback: (error, value) => {
            if(stopDone) {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            }else {
              stopDone = true 
              uploadTask(wrapper)
            }
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

        await sleep(100)

        stopTask(wrapper)

        
      });
    });

  })

  it(`retry the task when the task error before`, async () => {

    await new Promise(async (resolve, reject) => {
      let errorDone = false;

      const ref = React.createRef();

      const props = {
        viewType: 'list',
        immediately: false,
        request: {
          ...DEFAULT_REQUEST,
          exitDataFn,
          uploadFn: (...args) => {
            if(!errorDone) {
              throw new Error()
            }
            return uploadFn(...args)
          },
          callback: (error, value) => {
            if(errorDone) {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            }else {
              errorDone = true 
              uploadTask(wrapper)
            }
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
        
      });
    });

  })

  it(`use the ref to get the task`, async () => {

    await new Promise(async (resolve, reject) => {

      const ref = React.createRef();

      const props = {
        viewType: 'list',
        immediately: false,
        onChange: (value) => {
          const target = value[0]
          const task = ref.current.getTask(target.name)
          expect(task).not.toEqual(null)
          resolve()
        },
        request: {
          ...DEFAULT_REQUEST,
          exitDataFn,
          uploadFn: (...args) => {
            return uploadFn(...args)
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
        
      });
    });

  })


});
