import sys
import traceback
from IPython import get_ipython
from IPython.core.interactiveshell import InteractiveShell

if get_ipython() is None:
    ipython = InteractiveShell.instance()
else:
    ipython = get_ipython()

sys.stdout = _override_stdout # type:ignore

# class CodeExecutionError(Exception):
#     def __init__(self, error, traceback_str):
#         self.error = error
#         self.traceback_str = traceback_str
#         self.error_json = {
#             "ename": type(error).__name__,
#             "evalue": str(error),
#             "traceback": traceback_str.split('\n')
#         }
#         super().__init__(f"Error executing code: {error}")
        
#     def get_error_json(self):
#         return self.error_json

def implement_overrides():
   # matplotlib backend
   if "matplotlib" in sys.modules:
      import matplotlib
      matplotlib.use('AGG')


def run_cell(code, cell_id):
  try:
    result = ipython.run_cell(code, cell_id)
    if result.success:
        if (result.result == None):
            return None
        else:
            return repr(ipython.display_formatter.format(result.result))
    else:
        _exception.write(str(result.error_in_exec)) # type:ignore
  except:
    _exception.write("unhandled exception") #type:ignore
    # tb_str = ''.join(traceback.format_exception(
    #     type(error), error, error.__traceback__))
    # return CodeExecutionError(error, tb_str).get_error_json()