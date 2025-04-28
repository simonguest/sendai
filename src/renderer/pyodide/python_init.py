# type:ignore
import sys
sys.stdout = _override_stdout 

# def implement_overrides():
#    # matplotlib backend
#    try:
#       import matplotlib
#       matplotlib.use('AGG')
#       def matplotlib_custom_show():
#          import io, base64
#          buf = io.BytesIO()
#          plt.savefig(buf, format='png', bbox_inches='tight')
#          buf.seek(0)
#          image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
#          js.imageBase64(image_base64)
#          plt.clf()
#          plt.close()
#          buf.close()  
#       plt.show = matplotlib_custom_show    
#    except:
#       pass