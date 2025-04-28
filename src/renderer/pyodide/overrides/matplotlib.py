import matplotlib # type:ignore
import matplotlib.pyplot as plt # type:ignore
import io
import base64

matplotlib.use('AGG')

def custom_show():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    js.imageBase64(image_base64) # type:ignore    
    plt.clf()
    plt.close()
    buf.close()

# Override the original show function
plt.show = custom_show