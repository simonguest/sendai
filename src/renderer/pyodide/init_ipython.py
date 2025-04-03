import io
import sys
from IPython import get_ipython
from IPython.core.interactiveshell import InteractiveShell

if get_ipython() is None:
    ipython = InteractiveShell.instance()
else:
    ipython = get_ipython()

sys.stdout = _override_stdout # type:ignore