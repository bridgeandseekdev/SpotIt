import { useThemeContext } from '../context';

const AppVersionSwitch = () => {
  const { toggleRefactoredApp, isRefactoredVersion } = useThemeContext();
  return (
    <div className="absolute top-12 right-6 z-50">
      <button onClick={toggleRefactoredApp}>
        {isRefactoredVersion ? 'V1' : 'V2'}
      </button>
    </div>
  );
};

export default AppVersionSwitch;
