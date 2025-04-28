import sys

sys.stdout = _override_stdout # type:ignore

def implement_overrides():
   # matplotlib backend
   print("checking overrides")
   if "matplotlib" in sys.modules:
      print("matplotlib found")
      import matplotlib
      matplotlib.use('AGG')