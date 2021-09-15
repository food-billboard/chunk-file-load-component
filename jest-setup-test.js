import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

jest.mock('nanoid', () => {
  return {
    nanoid: () => Math.random().toString(),
  };
});

global.URL.createObjectURL = jest.fn(() => 'faker createObjectURL');

configure({ adapter: new Adapter() });
