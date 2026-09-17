def append(fn, txt):
    import os
    d = os.path.dirname(fn)
    if d: os.makedirs(d, exist_ok=True)
    with open(fn, 'a', encoding='utf-8') as f:
        f.write(txt)

def clear(fn):
    import os
    d = os.path.dirname(fn)
    if d: os.makedirs(d, exist_ok=True)
    with open(fn, 'w', encoding='utf-8') as f:
        pass
