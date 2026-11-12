import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
PAPER=(255,247,230); INK=(0x2B,0x1A,0x0F); SOFT=(0x6B,0x4A,0x2B); SHADOW=(0x7A,0x4A,0x00)
FD='C:/Users/goldg/family-chore-board/node_modules/@expo-google-fonts/'
FRED=FD+'fredoka/Fredoka_700Bold.ttf'; NUN=FD+'nunito/Nunito_700Bold.ttf'
devices={ # name: (raw dir, plate, band css px * scale, phone?)
 'iphone-6.9':('iphone-6.9','bg-1290x2796',177,True),
 'iphone-6.5':('iphone-6.5','bg-1242x2688',144,True),
 'ipad-13':('ipad-13','bg-2064x2752',72,True),
 'android-phone':('android-phone','bg-1080x1920',72,True)}
caps={1:(['One board for the','whole household'],None),2:(['Tap, stamp, done'],'Every chore gets a stamp.'),
 3:(['Points and rewards,','optional'],None),4:(['Works for the','barn too'],'Chores for adults, no points needed.'),
 5:(['Set chores once.','They repeat weekly.'],None),6:(['No ads. No accounts.','Pay once.'],'Data stays on your device.')}
jar=Image.open('icon/jar-sticker.png')
def status_bar(im,band,bg,scale):
    d=ImageDraw.Draw(im); d.rectangle((0,0,im.width,band),fill=bg)
    fs=max(14,int(band*0.36)); f=ImageFont.truetype(NUN,fs); cy=band*0.58
    d.text((im.width*0.08,cy),'9:41',font=f,fill=INK,anchor='lm')
    x=im.width*0.92; h=fs*0.8
    # battery
    bw=fs*1.9; d.rounded_rectangle((x-bw,cy-h/2,x,cy+h/2),radius=h*0.3,outline=INK,width=max(2,int(fs*0.08)))
    d.rounded_rectangle((x-bw+fs*0.12,cy-h/2+fs*0.12,x-fs*0.12-bw*0.12,cy+h/2-fs*0.12),radius=h*0.15,fill=INK)
    x-=bw+fs*0.5
    # wifi (3 arcs + dot)
    for r in (fs*0.75,fs*0.5,fs*0.25):
        d.arc((x-fs*0.5-r*0.0-r,cy+fs*0.25-r,x-fs*0.5+r,cy+fs*0.25+r),225,315,fill=INK,width=max(2,int(fs*0.12)))
    x-=fs*1.5
    # signal
    for i in range(4):
        bh=fs*(0.3+0.17*i); bx=x-fs*1.2+i*fs*0.32
        d.rounded_rectangle((bx,cy+h/2-bh,bx+fs*0.2,cy+h/2),radius=2,fill=INK)
def fit_font(path,txt,maxw,size):
    d=ImageDraw.Draw(Image.new('RGB',(10,10)))
    while d.textlength(txt,font=ImageFont.truetype(path,size))>maxw: size-=2
    return ImageFont.truetype(path,size)
def make(dev,n):
    rd,pl,band,phone=devices[dev]
    plate=Image.open(f'screens/{pl}.png').convert('RGBA'); W,H=plate.size; k=W/1290
    lines,sub=caps[n]
    d=ImageDraw.Draw(plate)
    size=int(138*k)
    fonts=[fit_font(FRED,l,W*0.9,size) for l in lines]; size=min(f.size for f in fonts)
    f=ImageFont.truetype(FRED,size); y=int(H*0.045) if len(lines)==2 else int(H*0.06)
    lh=int(size*1.12)
    for l in lines:
        d.text((W/2,y),l,font=f,fill=INK,anchor='mt'); y+=lh
    if sub:
        fs=fit_font(NUN,sub,W*0.85,int(52*k)); d.text((W/2,y+int(14*k)),sub,font=fs,fill=SOFT,anchor='mt')
    if n==6:
        jh=int(min(H*0.36,W*0.62*jar.height/jar.width)); j=jar.resize((round(jar.width*jh/jar.height),jh),Image.LANCZOS)
        jx=(W-j.width)//2; jy=int(H*0.60-jh/2)
        a=j.split()[3]; sh=Image.new('RGBA',j.size,SHADOW+(0,)); sh.putalpha(a.point(lambda v:int(v*0.2)))
        plate.alpha_composite(sh,(jx,jy+int(18*k))); plate.alpha_composite(j,(jx,jy))
        return plate.convert('RGB')
    raw=Image.open(f'raw-screens/{rd}/S{n}.png').convert('RGB')
    bg=(0xF4,0xF6,0xF2) if n==5 else PAPER
    status_bar(raw,band,bg,k)
    if phone:  # home indicator
        dd=ImageDraw.Draw(raw); bw=int(raw.width*0.36); dd.rounded_rectangle(((raw.width-bw)//2,raw.height-int(raw.height*0.012)-8,(raw.width+bw)//2,raw.height-int(raw.height*0.012)),radius=6,fill=INK)
    crop=None
    if dev=='ipad-13':
        import numpy as np
        a=np.asarray(raw).astype(int); bgc=np.array(bg); rows=np.where((np.abs(a-bgc).sum(2)>12).any(1))[0]
        rows=rows[rows>band+4]; last=rows.max()
        crop=min(1.0,(last+60*2)/raw.height)
    if crop: raw=raw.crop((0,0,raw.width,int(raw.height*crop)))
    topy=int(H*(0.225 if len(lines)==2 or sub else 0.2))
    sw=int(W*0.84); sh_=round(sw*raw.height/raw.width)
    if dev=='ipad-13' and sub: topy=int(H*0.255)
    maxh=int(H*0.80) if dev!='ipad-13' else min(int(H*0.80),H-topy-int(40*k))
    if crop:
        sw=int(W*0.9); sh_=round(sw*raw.height/raw.width)
        if sh_>H*0.74:
            sh_=int(H*0.74); sw=round(sh_*raw.width/raw.height)
        topy=int(H*0.23+(H*0.75-sh_)/2*0.8)
    if dev=='ipad-13':
        topy=int(H*(0.28 if sub else 0.225)); maxh=min(int(H*0.80),H-topy-int(40*k))
    if sh_>maxh: sh_=maxh; sw=round(sh_*raw.width/raw.height)
    scr=raw.resize((sw,sh_),Image.LANCZOS)
    bz=int(W*0.013); rad=int(W*0.075)
    fw,fh=sw+2*bz,sh_+2*bz; fx=(W-fw)//2; fy=topy
    # hard offset shadow
    shl=Image.new('RGBA',(W,H),(0,0,0,0)); ds=ImageDraw.Draw(shl)
    ds.rounded_rectangle((fx,fy+int(22*k),fx+fw,fy+fh+int(22*k)),radius=rad+bz,fill=SHADOW+(46,)); plate.alpha_composite(shl)
    fr=Image.new('RGBA',(fw,fh),(0,0,0,0)); ImageDraw.Draw(fr).rounded_rectangle((0,0,fw-1,fh-1),radius=rad+bz,fill=INK+(255,))
    m=Image.new('L',(sw,sh_),0); ImageDraw.Draw(m).rounded_rectangle((0,0,sw-1,sh_-1),radius=rad,fill=255)
    fr.paste(scr,(bz,bz),m)
    plate.alpha_composite(fr,(fx,fy))
    return plate.convert('RGB')
os.makedirs('screenshots',exist_ok=True)
for dev in devices:
    os.makedirs(f'screenshots/{dev}',exist_ok=True)
    for n in range(1,7):
        im=make(dev,n); im.save(f'screenshots/{dev}/{n:02d}.png'); 
    print(dev,im.size,im.mode)
