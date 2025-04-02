import io
import sys
from IPython import get_ipython
from IPython.core.interactiveshell import InteractiveShell

if get_ipython() is None:
    ipython = InteractiveShell.instance()
else:
    ipython = get_ipython()

class StdCapture:
    def __init__(self):
        self.stdout = io.StringIO()
        self.stderr = io.StringIO()
        self._stdout = sys.stdout
        self._stderr = sys.stderr

    def start(self):
        sys.stdout = self.stdout
        sys.stderr = self.stderr

    def stop(self):
        sys.stdout = self._stdout
        sys.stderr = self._stderr

    def get_output(self):
        return self.stdout.getvalue(), self.stderr.getvalue()

# Create a capture object
std_capture = StdCapture()

# Define function to run a cell
def run_cell(code, cell_id):
  return ipython.run_cell(code, cell_id=cell_id)